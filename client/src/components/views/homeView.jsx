import {
  Link,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import styled from 'styled-components';
import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';

import { formatCurrency, calcReturnPercent } from '../../utils/investments';

const ColoredFundName = styled(Link)`
  color: ${({ $color }) => $color};
`;

const HomeView = ({
  columnHeadersByDataPoint,
  filterColumnHeaders,
  filterPeriod,
  portfolioData,
  selectableColumnHeader,
  selectedColumn,
  FilterHeaderCell,
  onColumnHeaderClick,
  onFundNameClick
}) => {
  const theme = useTheme();
  const entityColors = theme.palette.entities;

  const rows = useMemo(() => portfolioData.map(({ fundName, investmentRoundsSummary }) => {
    const currentInvestment = investmentRoundsSummary.at(-1);
    const returnPercent = calcReturnPercent(
      currentInvestment.totalValue,
      currentInvestment.investedCapital
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
          { <TableCell>{selectableColumnHeader}</TableCell> }
          {
            Object.entries(columnHeadersByDataPoint).map(([dataPoint, title], idx) => (
              <FilterHeaderCell
                key={title}
                $selectable={filterColumnHeaders.includes(title)}
                $selected={idx === selectedColumn.idx}
                onClick={() =>
                  filterColumnHeaders.includes(title) &&
                  onColumnHeaderClick({ idx, title, dataPoint })
                }
              >
                {title}
              </FilterHeaderCell>
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
          }, idx) => {
            const cells = [
              formatCurrency(totalValue),
              formatCurrency(investedCapital),
              formatCurrency(realizedValue),
              formatCurrency(unrealizedValue),
              `${returnPercent}%`
            ];

            return (
              <TableRow key={fundName} hover>
                <TableCell>
                  <ColoredFundName
                    key={fundName}
                    component="button"
                    underline="hover"
                    $color={entityColors[idx % entityColors.length]}
                    onClick={() => onFundNameClick(fundName)}
                  >
                    {fundName}
                  </ColoredFundName>
                </TableCell>
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
