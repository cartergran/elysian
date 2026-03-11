import {
  Link,
  TableBody,
  TableHead,
  TableRow
} from '@mui/material';
import styled from 'styled-components';
import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';

import { ColoredName, DataCell, HIDE_ON_MOBILE_INDICES, NameCell } from '../tableStyles';
import { formatCurrency, calcReturnPercent } from '../../utils/investments';

const FundNameLink = styled(ColoredName).attrs({ as: Link })`
  max-width: 100%;
  min-height: 32px;

  display: inline-block;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${({ theme }) => theme.breakpoints.up('md')} {
    min-height: 44px;
  }
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
          { <NameCell>{selectableColumnHeader}</NameCell> }
          {
            Object.entries(columnHeadersByDataPoint).map(([dataPoint, title], idx) => (
              <FilterHeaderCell
                key={title}
                $hideOnMobile={HIDE_ON_MOBILE_INDICES.has(idx)}
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
                <NameCell>
                  <FundNameLink
                    key={fundName}
                    component="button"
                    underline="hover"
                    $color={entityColors[idx % entityColors.length]}
                    onClick={() => onFundNameClick(fundName)}
                  >
                    {fundName}
                  </FundNameLink>
                </NameCell>
                {
                  cells.map((cell, idx) => (
                    <DataCell key={idx} $hideOnMobile={HIDE_ON_MOBILE_INDICES.has(idx)}>
                      {cell}
                    </DataCell>
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
