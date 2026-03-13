import styled from 'styled-components';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableContainer,
} from '@mui/material';

import { FilterHeaderCell } from './tableStyles';
import FundView from './views/fundView';
import HomeView from './views/homeView';

import {
  COLUMN_HEADERS_BY_DATA_POINT,
  FILTER_COLUMN_HEADERS,
  SELECTABLE_COLUMN_HEADERS
} from '../utils/portfolio';

const viewRegistry = {
  HOME: HomeView,
  FUND: FundView
};

const StyledPortfolio = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const SortableFormControl = styled(FormControl)`
  min-width: 180px;

  align-self: flex-end;
`;

const ScrollableTableContainer = styled(TableContainer)`
  max-height: 440px;

  overflow-y: auto;
`;

const StyledTable = styled(Table)`
  table-layout: fixed;

  ${({ theme }) => theme.breakpoints.up('sm')} {
    table-layout: auto;
  }
`;

const Portfolio = ({ model, view, controller }) => {
  const ActiveView = viewRegistry[view.mode] || (() => null);
  const columnHeadersByDataPoint = COLUMN_HEADERS_BY_DATA_POINT[view.mode] || {};

  return (
    <StyledPortfolio>
      <SortableFormControl size="small">
        <InputLabel htmlFor="sort-select">
          Sort by
        </InputLabel>
        <Select
          inputProps={{ id: 'sort-select' }}
          label="Sort by"
          value={model.sortColumn}
          onChange={(e) => controller.onSortChange(e.target.value)}
        >
          {
            Object.entries(columnHeadersByDataPoint).map(([key, label]) => (
              <MenuItem key={key} value={key}>{label}</MenuItem>
            ))
          }
        </Select>
      </SortableFormControl>
      <ScrollableTableContainer>
        <StyledTable stickyHeader>
          <ActiveView
            columnHeadersByDataPoint={columnHeadersByDataPoint}
            filterColumnHeaders={FILTER_COLUMN_HEADERS[view.mode]}
            selectableColumnHeader={SELECTABLE_COLUMN_HEADERS[view.mode]}
            FilterHeaderCell={FilterHeaderCell}
            {...model}
            {...controller}
          />
        </StyledTable>
      </ScrollableTableContainer>
    </StyledPortfolio>
  );
};

export default Portfolio;
