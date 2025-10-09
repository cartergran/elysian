import {
  Link, // TODO
  TableBody,
  TableHead,
  TableRow
} from '@mui/material';
import { StyledHeaderCell, StyledBodyCell } from '../portfolio';
import { useMemo } from 'react';

import { formatCurrency, getReturnPercent } from '../../utils/investments';

const FundView = ({
  columnHeadersByDataPoint,
  portfolioData,
  selectableColumnHeaders,
  selectedColumn,
  filterPeriod,
  onColumnHeaderClick
}) => {
  const rows = useMemo(() => portfolioData.map(({ companyName, investmentRounds }) => {
    let currentInvestment = investmentRounds.at(-1);
    let returnPercent = getReturnPercent(
      currentInvestment,
      investmentRounds,
      filterPeriod
    );

    return {
      companyName,
      investedCapital: currentInvestment.investedCapital,
      totalValue: currentInvestment.totalValue,
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
          rows.map(({ companyName, totalValue, investedCapital, returnPercent }) => {
            let cells = [
              companyName,
              formatCurrency(totalValue),
              formatCurrency(investedCapital),
              `${returnPercent}%`
            ];

            return (
              <TableRow key={companyName}>
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

export default FundView;
