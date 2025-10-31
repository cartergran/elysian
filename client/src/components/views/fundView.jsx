import {
  Checkbox,
  // TODO: Link,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { StyledHeaderCell } from '../portfolio';
import { useMemo } from 'react';
import styled from 'styled-components';

import { formatCurrency, getReturnPercent } from '../../utils/investments';

const StyledCheckbox = styled(Checkbox)`
  padding: 0;

  & .MuiSvgIcon-root {
    font-size: 20px;
  }
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
  onToggleEntities
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
              <StyledHeaderCell
                key={title}
                $selectable={selectableColumnHeaders.includes(title)}
                $selected={idx === selectedColumn.idx}
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
                  <TableCell $open={chartCompanies}>
                    <StyledCheckbox
                      checked={selectedEntities.has(companyName)}
                      onChange={(e) => { e.stopPropagation(); onToggleEntity(companyName); }}
                    />
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
