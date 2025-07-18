import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Chart from './chart';
import Filter from './filter';
import Portfolio from './portfolio'

import fundA from '../reports/atlastInnovationFund.json';
import fundB from '../reports/equinoxVenturesFund.json';
import fundC from '../reports/helixFrontierFund.json';

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
  const [view, setView] = useState(0);
  const [funds, setFunds] = useState([fundA, fundB, fundC]);
  const [chartData, setChartData] = useState([]);
  const [portfolioData, setPortfolioData] = useState([]);
  const [selectedFund, setSelectedFund] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState(null);

  useEffect(() => {
    if (selectedFund != null && selectedFilter != null) {
      setChartData(funds[selectedFund].fundTotalValueByPeriod.slice(-selectedFilter));
    } else if (selectedFund != null) {
      setChartData(funds[selectedFund].fundTotalValueByPeriod);
    } else if (selectedFilter != null) {
      setChartData(funds);
    } else {
      setChartData(funds);
    }
  }, [selectedFilter]);

  useEffect(() => {
    if (selectedFund != null) {
      setPortfolioData(funds[selectedFund].investments);
    } else {
      setPortfolioData(funds)
    }
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
        view={view}
        portfolioData={portfolioData}
        selectedFund={selectedFund}
        selectedFilter={selectedFilter}
        onFundChange={setSelectedFund}
      />
    </StyledDashboard>
  );
};

export default Dashboard;
