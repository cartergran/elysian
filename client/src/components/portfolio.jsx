import {
  Table,
  TableContainer,
} from '@mui/material';
import HomeView from './views/homeView';
import FundView from './views/fundView';

const views = [HomeView, FundView];

const Portfolio = ({ portfolioData, selectedFund, filteredPeriod, onSelectedFund }) => {
  const view = selectedFund != null ? 1 : 0;
  const ViewComponent = views[view] || (() => null);

  return (
    <TableContainer>
      <Table>
        <ViewComponent
          portfolioData={portfolioData}
          filteredPeriod={filteredPeriod}
          onSelectedFund={onSelectedFund}
        />
      </Table>
    </TableContainer>
  );
};

export default Portfolio;
