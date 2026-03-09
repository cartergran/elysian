import styled from 'styled-components';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableCell,
  TableContainer,
} from '@mui/material';

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

const FilterHeaderCell = styled(TableCell)`
  color:
    ${({ theme, $selected  }) => $selected
      ? theme.palette.primary.light
      : theme.palette.text.primary
    };
  font-size:
    ${({ theme, $selected  }) => $selected
      ? theme.typography.subtitle1.fontSize
      : theme.typography.subtitle2.fontSize
    };
  cursor: ${({ $selectable }) => $selectable ? 'pointer' : 'default'};
  transition: all 0.25s ease-in-out;
  user-select: none;
`;

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
        <Table stickyHeader>
          <ActiveView
            columnHeadersByDataPoint={columnHeadersByDataPoint}
            filterColumnHeaders={FILTER_COLUMN_HEADERS[view.mode]}
            selectableColumnHeader={SELECTABLE_COLUMN_HEADERS[view.mode]}
            FilterHeaderCell={FilterHeaderCell}
            {...model}
            {...controller}
          />
        </Table>
      </ScrollableTableContainer>
    </StyledPortfolio>
  );
};

export default Portfolio;
