import { getInvestmentRoundSummary } from '../utils.js';
import pool from '../infra/db.js';

/* Parse '2025-Q1' ---> { year: 2025, quarter: 1 } */
const parsePeriod = (p) => {
  const [y, q] = p.split('-Q');
  return { year: Number(y), quarter: Number(q) };
};

// payload := json
const upsertFund = async (payload) => {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // (1)
    // get fund_id (idempotent)
    // trick: set PK to LAST_INSERT_ID on duplicate so insertId returns the existing id
    const [fundRes] = await conn.execute(`
      INSERT INTO fund (fund_name)
        VALUES (?)
      ON DUPLICATE KEY UPDATE
        fund_id = LAST_INSERT_ID(fund_id)
      `,
      [payload.fundName]
    );
    const fundId = fundRes.insertId;

    // (2)
    const { year, quarter } = parsePeriod(payload.period);
    const iRows = [];
    for (const investment of payload.investments) {
      // (2a)
      const [companyRes] = await conn.execute(`
        INSERT INTO company (company_name)
          VALUES (?)
        ON DUPLICATE KEY UPDATE
          company_id = LAST_INSERT_ID(company_id)
        `,
        [investment.companyName]
      );
      const companyId = companyRes.insertId;

      // (2b)
      const [investmentRes] = await conn.execute(`
        INSERT INTO investment (fund_id, company_id)
          VALUES (?, ?)
        ON DUPLICATE KEY UPDATE
          investment_id = LAST_INSERT_ID(investment_id)
        `,
        [fundId, companyId]
      );
      const investmentId = investmentRes.insertId;

      // (2c)
      const iRow = investment.investmentRound;
      iRows.push([
        investmentId, year, quarter,
        iRow.investedCapital ?? 0,
        iRow.realizedValue ?? 0,
        iRow.unrealizedValue ?? 0,
        iRow.totalValue ?? 0,
        iRow.grossIrr // can be null
      ]);
    }

    if (iRows.length) {
      const ph = iRows.map(() => '(?,?,?,?,?,?,?,?)').join(',');
      await conn.execute(`
        INSERT INTO investment_round (
          investment_id, period_year, period_quarter,
          invested_capital, realized_value, unrealized_value, total_value, gross_irr_pct
        )
          VALUES ${ph}
        ON DUPLICATE KEY UPDATE
          invested_capital = VALUES(invested_capital),
          realized_value = VALUES(realized_value),
          unrealized_value = VALUES(unrealized_value),
          total_value = VALUES(total_value),
          gross_irr_pct = VALUES(gross_irr_pct)
        `,
        iRows.flat()
      );
    }

    // (3)
    const iSummaryRow = getInvestmentRoundSummary(payload);
    await conn.execute(`
      INSERT INTO fund_round_summary (
        fund_id, period_year, period_quarter,
        invested_capital, realized_value, unrealized_value, total_value
      )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        invested_capital = VALUES(invested_capital),
        realized_value = VALUES(realized_value),
        unrealized_value = VALUES(unrealized_value),
        total_value = VALUES(total_value)
      `,
      [
        fundId,
        year,
        quarter,
        iSummaryRow.investedCapital,
        iSummaryRow.realizedValue,
        iSummaryRow.unrealizedValue,
        iSummaryRow.totalValue,
      ]
    );

    await conn.commit();
    return { fundId };

  } catch(err) {
    await conn.rollback();
    throw new Error(`Failed to upsert fund apyload: ${err.message}`);
  } finally {
    conn.release();
  }
};

export default upsertFund;
