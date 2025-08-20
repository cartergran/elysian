import {
  Table,
  TableContainer,
} from '@mui/material';
import HomeView from './views/homeView';
import FundView from './views/fundView';

const views = [HomeView, FundView];

const Portfolio = ({ view, portfolioData, selectedFund, selectedFilter, onFundChange }) => {
  const ViewComponent = views[view] || (() => null);

  return (
    <TableContainer>
      <Table>
        <ViewComponent portfolioData={portfolioData} selectedFilter={selectedFilter} />
      </Table>
    </TableContainer>
  );
};

export default Portfolio;
