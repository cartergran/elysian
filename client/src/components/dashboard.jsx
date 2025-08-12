import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Chart from './chart';
import Filter from './filter';
import Portfolio from './portfolio'

import { toChartData } from '../utils/investments';

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

// funds := [{}]
const funds = [
  fundA,
  fundB,
  fundC
];

const Dashboard = () => {
  const [view, setView] = useState(0);
  const [selectedFund, setSelectedFund] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);

  // chartData := [{}]
  const chartData = useMemo(() => {
    let res = [];
    if (selectedFund != null) {
      // fund view
      let fund = funds[selectedFund];
      if (selectedFilter != null) {
        res.push({ [fund.fundName]: fund.investmentRoundsSummary.slice(-selectedFilter) });
      } else {
        res.push({ [fund.fundName]: fund.investmentRoundsSummary });
      }
    } else {
      // home view
      if (selectedFilter != null) {
        res = funds.reduce((acc, fund) => {
          acc[fund.fundName] = fund.investmentRoundsSummary.slice(-selectedFilter);
          return acc;
        }, {});
      } else {
        res = funds.reduce((acc, fund) => {
          acc[fund.fundName] = fund.investmentRoundsSummary;
          return acc;
        }, {});
      }
    }
    return toChartData(res);
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
      {/*
        <Portfolio
          view={view}
          portfolioData={portfolioData}
          selectedFund={selectedFund}
          selectedFilter={selectedFilter}
          onFundChange={setSelectedFund}
        />
      */}
    </StyledDashboard>
  );
};

export default Dashboard;
