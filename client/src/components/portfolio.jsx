import styled from 'styled-components';
import {
  Table,
  TableCell,
  TableContainer,
} from '@mui/material';

import FundView from './views/fundView';
import HomeView from './views/homeView';

const FilterHeaderCell = styled(TableCell)`
  color:
    ${({ theme, $selected  }) => $selected
      ? theme.palette.primary.light
      : theme.palette.secondary.main
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

const COLUMN_HEADERS_BY_DATA_POINT = {
  HOME: {
    totalValue: 'Total Value',
    investedCapital: 'Invested Capital',
    realizedValue: 'Realized Value',
    unrealizedValue: 'Unrealized Value',
    returnPercent: 'Return'
  },
  FUND: {
    totalValue: 'Total Value',
    investedCapital: 'Invested Capital',
    returnPercent: 'Return'
  }
};

const FILTER_COLUMN_HEADERS = [
  'Total Value',
  'Invested Capital',
  'Realized Value',
  'Unrealized Value'
];

const SELECTABLE_COLUMN_HEADERS = {
  HOME: 'Fund',
  FUND: 'Company'
};

const viewRegistry = {
  HOME: HomeView,
  FUND: FundView
};

const Portfolio = ({ model, view, controller }) => {
  const ActiveView = viewRegistry[view.mode] || (() => null);

  return (
    <TableContainer>
      <Table>
        <ActiveView
          columnHeadersByDataPoint={COLUMN_HEADERS_BY_DATA_POINT[view.mode]}
          filterColumnHeaders={FILTER_COLUMN_HEADERS}
          selectableColumnHeader={SELECTABLE_COLUMN_HEADERS[view.mode]}
          FilterHeaderCell={FilterHeaderCell}
          {...model}
          {...controller}
        />
      </Table>
    </TableContainer>
  );
};

export default Portfolio;
