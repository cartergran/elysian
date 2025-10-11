import FundView from './views/fundView';
import HomeView from './views/homeView';
import {
  Table,
  TableCell,
  TableContainer,
} from '@mui/material';
import styled from 'styled-components';

export const StyledHeaderCell = styled(TableCell)`
  color:
    ${({ $selected, theme }) => $selected
      ? theme.palette.primary.light
      : theme.palette.secondary.main
    };
  font-size:
    ${({ $selected, theme }) => $selected
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
    grossIRR: 'Gross IRR',
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

const views = {
  HOME: HomeView,
  FUND: FundView
};

const Portfolio = ({
  portfolioData,
  filterPeriod,
  selectedColumn,
  view,
  onColumnHeaderClick,
  onFundNameClick
}) => {
  const ViewComponent = views[view.mode] || (() => null);

  return (
    <TableContainer>
      <Table>
        <ViewComponent
          columnHeadersByDataPoint={COLUMN_HEADERS_BY_DATA_POINT[view.mode]}
          filterPeriod={filterPeriod}
          portfolioData={portfolioData}
          selectableColumnHeaders={SELECTABLE_COLUMN_HEADERS}
          selectedColumn={selectedColumn}
          onColumnHeaderClick={onColumnHeaderClick}
          onFundNameClick={onFundNameClick}
        />
      </Table>
    </TableContainer>
  );
};

export default Portfolio;
