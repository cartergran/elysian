import {
  Checkbox,
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

import { formatCurrency, getReturnPercent } from '../../utils/investments';

const StyledCheckbox = styled(Checkbox)`
  padding: 0;

  & .MuiSvgIcon-root {
    font-size: 20px;
  }
`;

const StyledCompanyName = styled(Typography)`
  color: ${({ $color }) => $color};
`;

// TODO:
const ToggleCell = styled(TableCell)``;

const FundView = ({
  chartCompanies,
  columnHeadersByDataPoint,
  filterPeriod,
  portfolioData,
  selectableColumnHeaders,
  selectedColumn,
  selectedEntities,
  onColumnHeaderClick,
  onToggleEntity,
  onToggleEntities,
  SelectableHeaderCell
}) => {
  const theme = useTheme();

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

  const entityColors = theme.palette.entities || [];
  const companyEntities = useMemo(() => rows.map((r) => r.companyName), [rows]);
  const indeterminate = selectedEntities.size > 0 && selectedEntities.size < companyEntities.length;
  const allSelected = companyEntities.length === selectedEntities.size;

  return (
    <>
      <TableHead>
        <TableRow>
          {
            <TableCell $open={chartCompanies}>
              <StyledCheckbox
                checked={allSelected}
                indeterminate={indeterminate}
                onChange={(e) => { e.stopPropagation(); onToggleEntities(companyEntities); }}
              />
            </TableCell>
          }
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
          rows.map(({ companyName, totalValue, investedCapital, returnPercent }, idx) => {
            const cells = [
              formatCurrency(totalValue),
              formatCurrency(investedCapital),
              `${returnPercent}%`
            ];

            return (
              <TableRow key={companyName}>
                {
                  <TableCell $open={chartCompanies}>
                    <StyledCheckbox
                      checked={selectedEntities.has(companyName)}
                      onChange={(e) => { e.stopPropagation(); onToggleEntity(companyName); }}
                    />
                  </TableCell>
                }
                {
                  <TableCell>
                    <StyledCompanyName
                      variant="span"
                      $color={entityColors[idx % entityColors.length]}
                    >
                      {companyName}
                    </StyledCompanyName>
                  </TableCell>
                }
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

export default FundView;
