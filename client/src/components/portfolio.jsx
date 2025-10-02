import {
  Table,
  TableContainer,
} from '@mui/material';
import HomeView from './views/homeView';
import FundView from './views/fundView';

const views = {
  HOME: HomeView,
  FUND: FundView
};

const Portfolio = ({ portfolioData, filterPeriod, view, onSelectedFund }) => {
  const ViewComponent = views[view.mode] || (() => null);

  return (
    <TableContainer>
      <Table>
        <ViewComponent
          portfolioData={portfolioData}
          filterPeriod={filterPeriod}
          onSelectedFund={onSelectedFund}
        />
      </Table>
    </TableContainer>
  );
};

export default Portfolio;
