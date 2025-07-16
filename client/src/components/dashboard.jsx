import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Chart from './chart';
import Filter from './filter';
import Portfolio from './portfolio'

import mockReport from '../reports/mockReport.json';

const StyledDashboard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-m);

  width: 100%;

  padding: var(--space-xl);
`;

const filters = {
  '1Q': 2,
  '2Q': 3,
  '1Y': 5,
  '2Y': 9
};

const Dashboard = () => {
  const [funds, setFunds] = useState([mockReport]);
  const [chartData, setChartData] = useState([]);
  const [portfolioData, setPortfolioData] = useState([]);
  // TODO: const [selectedFund, setSelectedFund] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);

  useEffect(() => {
    if (selectedFilter) {
      setChartData(funds[0].fundTotalValueByPeriod.slice(-selectedFilter));
    } else {
      setChartData(funds[0].fundTotalValueByPeriod);
    }
  }, [selectedFilter]);

  useEffect(() => {
    setPortfolioData(funds[0].investments);
  }, []);

  return (
    <StyledDashboard>
      <Chart
        chartData={chartData}
        selectedFilter={selectedFilter}
      />
      <Filter
        filters={filters}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />
      <Portfolio
        portfolioData={portfolioData}
        selectedFilter={selectedFilter}
        // onFundChange={setSelectedFund}
      />
    </StyledDashboard>
  );
};

export default Dashboard;
