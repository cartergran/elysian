import {
  Link,
  TableBody,
  TableHead,
  TableRow
} from '@mui/material';
import { StyledHeaderCell, StyledBodyCell } from '../portfolio';
import { useMemo } from 'react';

import { formatCurrency, getReturnPercent } from '../../utils/investments';

const HomeView = ({
  columnHeadersByDataPoint,
  filterPeriod,
  portfolioData,
  selectableColumnHeaders,
  selectedColumn,
  onColumnHeaderClick,
  onFundNameClick
}) => {
  const rows = useMemo(() => portfolioData.map(({ fundName, investmentRoundsSummary }) => {
    let currentInvestment = investmentRoundsSummary.at(-1);
    let returnPercent = getReturnPercent(
      currentInvestment,
      investmentRoundsSummary,
      filterPeriod
    );

    return {
      fundName,
      totalValue: currentInvestment.totalValue,
      investedCapital: currentInvestment.investedCapital,
      realizedValue: currentInvestment.realizedValue,
      unrealizedValue: currentInvestment.unrealizedValue,
      grossIRR: currentInvestment.grossIRR,
      returnPercent
    };
  }), [portfolioData, filterPeriod]);

  return (
    <>
      <TableHead>
        <TableRow>
          {
            Object.entries(columnHeadersByDataPoint).map(([dataPoint, title], idx) => (
              <StyledHeaderCell
                key={title}
                $selectable={selectableColumnHeaders.includes(title)}
                $selected={idx === selectedColumn?.idx}
                onClick={() =>
                  selectableColumnHeaders.includes(title) &&
                  onColumnHeaderClick(idx, title, dataPoint)
                }
              >
                {title}
              </StyledHeaderCell>
            ))
          }
        </TableRow>
      </TableHead>
      <TableBody>
        {
          rows.map(({
            fundName,
            totalValue,
            investedCapital,
            realizedValue,
            unrealizedValue,
            grossIRR,
            returnPercent
        }) => {
            let cells = [
              <Link component="button" underline="hover" onClick={() => onFundNameClick(fundName)}>
                {fundName}
              </Link>,
              formatCurrency(totalValue),
              formatCurrency(investedCapital),
              formatCurrency(realizedValue),
              formatCurrency(unrealizedValue),
              `${grossIRR}%`,
              `${returnPercent}%`
            ];

            return (
              <TableRow key={fundName}>
                {
                  cells.map((cell, idx) => (
                    <StyledBodyCell key={idx} $selected={idx === selectedColumn?.idx}>
                      {cell}
                    </StyledBodyCell>
                  ))
                }
              </TableRow>
            );
          })
        }
      </TableBody>
    </>
  );
};

export default HomeView;
