import {
  // TODO: Link,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import styled from 'styled-components';
import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';

import { formatCurrency, calcReturnPercent } from '../../utils/investments';

const ColoredCompanyName = styled(Typography)`
  color: ${({ $color }) => $color};
`;

const FadedTableRow = styled(TableRow)`
  opacity: ${({ $isVisible }) => $isVisible ? 1 : 0.25};
  transition: opacity 0.25s ease;
`;

const SelectableTableCell = styled(TableCell)`
  cursor: ${({ $selectable }) => $selectable ? 'pointer' : 'default'};
`;

// const ToggleCell = styled(TableCell)`
//   animation: slideIn 0.25s ease;
//   backface-visibility: hidden; // prevents flickering
//   transform: translateZ(0); // hardware acceleration
//   will-change: opacity, transform; // performance optimization
// `;

const FundView = ({
  chartCompanies,
  columnHeadersByDataPoint,
  filterColumnHeaders,
  filterPeriod,
  portfolioData,
  selectableColumnHeader,
  selectedColumn,
  selectedEntities,
  showSelectedOnly,
  visibleEntities,
  FilterHeaderCell,
  onColumnHeaderClick,
  onHoverRow,
  onToggleRow,
  onToggleRows,
}) => {
  const theme = useTheme();
  const entityColors = theme.palette.entities;

  const rows = useMemo(() => {
    let retVal = {};

    if (chartCompanies && showSelectedOnly) {
      retVal = portfolioData.filter(({ companyName }) => selectedEntities.has(companyName));
    } else {
      retVal = portfolioData;
    }

    return retVal.map(({ companyName, investmentRounds }) => {
      const currentInvestment = investmentRounds.at(-1);
      const returnPercent = calcReturnPercent(
        currentInvestment.totalValue,
        currentInvestment.investedCapital
      );

      return {
        companyName,
        investedCapital: currentInvestment.investedCapital,
        totalValue: currentInvestment.totalValue,
        realizedValue: currentInvestment.realizedValue,
        unrealizedValue: currentInvestment.unrealizedValue,
        returnPercent
      };
    });
  }, [chartCompanies, portfolioData, selectedEntities, showSelectedOnly, filterPeriod]);

  const companyEntities = useMemo(() => rows.map((r) => r.companyName), [rows]);
  const handleSelectableHeaderClick = (e) => {
    e.stopPropagation();
    onToggleRows(companyEntities);
  };

  return (
    <>
      <TableHead>
        <TableRow>
          {
            <SelectableTableCell
              $selectable={chartCompanies}
              onClick={handleSelectableHeaderClick}
            >
              {selectableColumnHeader}
            </SelectableTableCell>
          }
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
            companyName,
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
            const isVisible = !chartCompanies || visibleEntities.has(companyName);
            const handleSelectableCellClick = (e) => {
              e.stopPropagation();
              onToggleRow(companyName);
            };

            return (
              <FadedTableRow
                key={companyName}
                hover
                $isVisible={isVisible}
                {...chartCompanies && {
                  onMouseEnter: () => onHoverRow(companyName),
                  onMouseLeave: () => onHoverRow(null)
                }}
              >
                {
                  <SelectableTableCell
                    $selectable={chartCompanies}
                    {...chartCompanies && {
                      onClick: handleSelectableCellClick
                    }}
                  >
                    <ColoredCompanyName
                      variant="span"
                      $color={entityColors[idx % entityColors.length]}
                    >
                      {companyName}
                    </ColoredCompanyName>
                  </SelectableTableCell>
                }
                {
                  cells.map((cell, idx) => (
                    <TableCell key={idx}>
                      {cell}
                    </TableCell>
                  ))
                }
              </FadedTableRow>
            );
          })
        }
      </TableBody>
    </>
  );
};

export default FundView;
