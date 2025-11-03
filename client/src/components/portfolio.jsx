import styled from 'styled-components';
import {
  Table,
  TableCell,
  TableContainer,
} from '@mui/material';
import { useMemo } from 'react';

import FundView from './views/fundView';
import HomeView from './views/homeView';

export const StyledHeaderCell = styled(TableCell)`
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
    fundName: 'Fund',
    totalValue: 'Total Value',
    investedCapital: 'Invested Capital',
    realizedValue: 'Realized Value',
    unrealizedValue: 'Unrealized Value',
    returnPercent: 'Return'
  },
  FUND: {
    companyName: 'Company',
    totalValue: 'Total Value',
    investedCapital: 'Invested Capital',
    returnPercent: 'Return'
  }
};

const SELECTABLE_COLUMN_HEADERS = [
  'Total Value',
  'Invested Capital',
  'Realized Value',
  'Unrealized Value'
];

const viewRegistry = {
  HOME: HomeView,
  FUND: FundView
};

const Portfolio = ({ model, view, controller }) => {
  const SelectableHeaderCell = useMemo(() => StyledHeaderCell, []);
  const ActiveView = viewRegistry[view.mode] || (() => null);

  return (
    <TableContainer>
      <Table>
        <ActiveView
          columnHeadersByDataPoint={COLUMN_HEADERS_BY_DATA_POINT[view.mode]}
          selectableColumnHeaders={SELECTABLE_COLUMN_HEADERS}
          SelectableHeaderCell={SelectableHeaderCell}
          {...model}
          {...controller}
        />
      </Table>
    </TableContainer>
  );
};

export default Portfolio;
