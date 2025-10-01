import { useMemo, useState } from 'react';
import styled from 'styled-components';
import Chart from './chart';
import Filter from './filter';
import HeaderBar from './headerbar';
import Portfolio from './portfolio';

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

const FILTERS = [
  { label: '1Q', period: 1 },
  { label: '2Q', period: 2 },
  { label: '1Y', period: 4 },
  { label: '2Y', period: 8 },
  { label: 'ALL', period: Infinity }
];
const lastPeriod = (p, arr) => (p === Infinity ? arr : arr.slice(-(p + 1)));

const funds = [
  fundA,
  fundB,
  fundC
];

const homeTitle = 'Financial Overview';
const getBreadcrumbs = (selectedFund, selectedCompany) => {
  let res = [{ label: homeTitle, onClickArg: null }];
  if (selectedFund != null) {
    let fundName = funds[selectedFund].fundName;
    res.push({ label: fundName, onClickArg: selectedFund });
  }
  if (selectedCompany) {
    // TODO
  }
  return res;
};

const Dashboard = () => {
  const [selectedFund, setSelectedFund] = useState(null);
  const [filter, setFilter] = useState('ALL');

  const filteredPeriod = FILTERS.find(f => f.label === filter).period;
  const breadcrumbs = getBreadcrumbs(selectedFund);

  /*
    toChartData() := {
      entityNames: [
        [entityNameA],
        [entityNameB],
        ...
      ],
      totalValuesByPeriod: [
        {
          period: [periodOne],
          [entityNameA]: totalValueA,
          [entityNameB]: totalValueB,
          ...
        },
        {
          period: [periodTwo],
          [entityNameA]: totalValueA,
          [entityNameB]: totalValueB,
          ...
        },
        ...
      ]
    }
  */
  const chartData = useMemo(() => {
    let res = {};
    if (selectedFund != null) {
      // fund view
      let fund = funds[selectedFund];
      res = { [fund.fundName]: lastPeriod(filteredPeriod, fund.investmentRoundsSummary) };
    } else {
      // home view
      res = funds.reduce((acc, fund) => {
        acc[fund.fundName] = lastPeriod(filteredPeriod, fund.investmentRoundsSummary);
        return acc;
      }, {});
    }

    return toChartData(res);
  }, [selectedFund, filter]);

  /*
    portfolioData := [
      {
        company: [companyA],
        investmentRounds: {...}
      },
      {
        company: [companyB],
        investmentRounds: {...}
      },
      ...
    ]
  */
  const portfolioData = useMemo(() => {
    let res = [];
    if (selectedFund != null) {
      res = funds[selectedFund].investments;
    } else {
      res = funds.map(({ fundName, investmentRoundsSummary }) => ({
        fundName,
        investmentRoundsSummary
      }));
    }
    return res;
  }, [selectedFund]);

  return (
    <StyledDashboard>
      <HeaderBar
        breadcrumbs={breadcrumbs}
        onBreadcrumbClick={setSelectedFund}
      />
      <Chart
        chartData={chartData}
      />
      <Filter
        options={FILTERS}
        selected={filter}
        onChange={setFilter}
      />
      <Portfolio
        portfolioData={portfolioData}
        selectedFund={selectedFund}
        filteredPeriod={filteredPeriod}
        onSelectedFund={setSelectedFund}
      />
    </StyledDashboard>
  );
};

export default Dashboard;
