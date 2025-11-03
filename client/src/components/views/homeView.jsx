import {
  Link,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { useMemo } from 'react';

import { formatCurrency, getReturnPercent } from '../../utils/investments';

const HomeView = ({
  columnHeadersByDataPoint,
  filterPeriod,
  portfolioData,
  selectableColumnHeaders,
  selectedColumn,
  onColumnHeaderClick,
  onFundNameClick,
  SelectableHeaderCell
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
      returnPercent
    };
  }), [portfolioData, filterPeriod]);

  return (
    <>
      <TableHead>
        <TableRow>
          {
            Object.entries(columnHeadersByDataPoint).map(([dataPoint, title], idx) => (
              <SelectableHeaderCell
                key={title}
                $selectable={selectableColumnHeaders.includes(title)}
                $selected={idx === selectedColumn.idx}
                onClick={() =>
                  selectableColumnHeaders.includes(title) &&
                  onColumnHeaderClick(idx, title, dataPoint)
                }
              >
                {title}
              </SelectableHeaderCell>
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
              `${returnPercent}%`
            ];

            return (
              <TableRow key={fundName}>
                {
                  cells.map((cell, idx) => (
                    <TableCell key={idx}>
                      {cell}
                    </TableCell>
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
