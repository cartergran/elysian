import { n } from '../utils.js';
import pool from '../infra/db.js';

const addFundInvestmentSummaries = (funds, iSummaryRows) => {
  for (const r of iSummaryRows) {
    const fundId = r.fund_id;
    if (!funds.has(fundId)) {
      funds.set(fundId, {
        fundName: r.fund_name,
        investmentsMap: new Map(),
        summaries: []
      });
    }

    const f = funds.get(fundId);
    f.summaries.push({
      period: r.period_label,
      investedCapital: n(r.invested_capital),
      realizedValue: n(r.realized_value),
      unrealizedValue: n(r.unrealized_value),
      totalValue: n(r.total_value),
      // grossIrr: ??
    });
  }
};

const addFundInvestments = (funds, iRows) => {
  for (const r of iRows) {
    const fundId = r.fund_id;
    // no-op
    if (!funds.has(fundId)) {
      funds.set(fundId, {
        fundName: r.fund_name,
        investmentsMap: new Map(),
        summaries: [],
      });
    }

    const f = funds.get(fundId);
    const companyId = r.company_id;
    if (!f.investmentsMap.has(companyId)) {
      f.investmentsMap.set(companyId, {
        companyName: r.company_name,
        investmentRounds: [],
      });
    }

    f.investmentsMap.get(companyId).investmentRounds.push({
      period: r.period_label,
      investedCapital: n(r.invested_capital),
      realizedValue: n(r.realized_value),
      unrealizedValue: n(r.unrealized_value),
      totalValue: n(r.total_value),
      grossIRR: n(r.gross_irr_pct),
    });
  }
};

const byPeriod = (a, b) => {
  const [ya, qa] = a.period.split('-Q').map(Number);
  const [yb, qb] = b.period.split('-Q').map(Number);
  return ya - yb || qa - qb;
};

const getFunds = async () => {
  const iSql = `
    SELECT
      f.fund_id,
      f.fund_name,
      c.company_name,
      ir.period_label,
      ir.period_year,
      ir.period_quarter,
      ir.invested_capital,
      ir.realized_value,
      ir.unrealized_value,
      ir.total_value,
      ir.gross_irr_pct
    FROM fund f
    JOIN investment i ON i.fund_id = f.fund_id
    JOIN company c ON c.company_id = i.company_id
    JOIN investment_round ir ON ir.investment_id = i.investment_id
    ORDER BY f.fund_id, c.company_name, ir.period_year, ir.period_quarter
  `;
  const [iRows] = await pool.query(iSql);

  const iSummarySql = `
    SELECT
      f.fund_id,
      f.fund_name,
      s.period_label,
      s.period_year,
      s.period_quarter,
      s.invested_capital,
      s.realized_value,
      s.unrealized_value,
      s.total_value
    FROM fund f
    JOIN fund_round_summary s ON s.fund_id = f.fund_id
    ORDER BY f.fund_id, s.period_year, s.period_quarter
  `;
  const [iSummaryRows] = await pool.query(iSummarySql);

  // console.log('iRows', iRows);
  // console.log('iSummaryRows', iSummaryRows);

  // TODO: throw new Error('Error retrieving funds, query mismatch.');

  const funds = new Map();
  addFundInvestmentSummaries(funds, iSummaryRows);
  addFundInvestments(funds, iRows);

  const retVal = [];
  for (const [_, f] of funds) {
    const investments = Array.from(f.investmentsMap.values()).map((c) => {
      c.investmentRounds.sort(byPeriod);
      return c;
    });

    retVal.push({
      fundName: f.fundName,
      investments,
      investmentRoundsSummary: f.summaries.sort(byPeriod)
    });
  }

  return retVal;
};

export default getFunds;
