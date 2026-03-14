import {
  // TODO: Link,
  TableBody,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import styled from 'styled-components';
import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';

import { ColoredName, DataCell, NameCell } from '../tableStyles';
import { formatCurrency, calcReturnPercent } from '../../utils/investments';

const CompanyName = styled(ColoredName).attrs({ as: Typography })``;

const FadedTableRow = styled(TableRow)`
  opacity: ${({ $isVisible }) => $isVisible ? 1 : 0.25};
  transition: opacity 0.25s ease;
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
  mobileColumn,
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

  const columnKeys = Object.keys(columnHeadersByDataPoint);
  const mobileColumnIdx = columnKeys.indexOf(mobileColumn);
  const returnPercentIdx = columnKeys.length - 1;
  const isHiddenOnMobile = (idx) => idx !== mobileColumnIdx && idx !== returnPercentIdx;

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
            <NameCell
              $selectable={chartCompanies}
              onClick={showSelectedOnly ? handleSelectableHeaderClick : undefined}
            >
              {selectableColumnHeader}
            </NameCell>
          }
          {
            Object.entries(columnHeadersByDataPoint).map(([dataPoint, title], idx) => (
              <FilterHeaderCell
                key={title}
                $hideOnMobile={isHiddenOnMobile(idx)}
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
                  <NameCell
                    $selectable={chartCompanies}
                    {...chartCompanies && {
                      onClick: handleSelectableCellClick
                    }}
                  >
                    <CompanyName
                      variant="span"
                      $color={entityColors[idx % entityColors.length]}
                    >
                      {companyName}
                    </CompanyName>
                  </NameCell>
                }
                {
                  cells.map((cell, idx) => (
                    <DataCell key={idx} $hideOnMobile={isHiddenOnMobile(idx)}>
                      {cell}
                    </DataCell>
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
