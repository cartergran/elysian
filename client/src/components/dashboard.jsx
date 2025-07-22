import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Chart from './chart';
import Filter from './filter';
import Portfolio from './portfolio'

import fundA from '../reports/nexacoreGrowthEquityFund.json';
import fundB from '../reports/polarisFutureVenturesFund.json';
import fundC from '../reports/vertexEdgeOpportunityFund.json';

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

const funds = [
  fundA,
  fundB,
  fundC
];

const Dashboard = () => {
  const [view, setView] = useState(0);
  const [selectedFund, setSelectedFund] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState(null);

  const chartData = useMemo(() => {
    let res = [];
    if (selectedFund != null && selectedFilter != null) {
      res = funds[selectedFund].summary.investmentRounds.slice(-selectedFilter);
    } else if (selectedFund != null) {
      res = funds[selectedFund].summary.investmentRounds;
    } else if (selectedFilter != null) {
      res = funds.map(({ summary }) => ({ summary: summary.slice(-selectedFilter) }));
    } else {
      res = funds.map(({ summary }) => ({ summary }));
    }
    return res;
  }, [selectedFund, selectedFilter]);

  const portfolioData = useMemo(() => {
    let res = [];
    if (selectedFund != null) {
      res = funds[selectedFund].investments;
    } else {
      res = funds.map(({ summary }) => ({ summary }));
    }
    return res;
  }, [selectedFund, selectedFilter]);

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
