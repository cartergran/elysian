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
const lastPeriod = (p, arr) => p === Infinity ? arr : arr.slice(-(p + 1));

const FUNDS = [
  fundA,
  fundB,
  fundC
];
const FUNDS_BY_NAME = FUNDS.reduce((acc, f) => { acc[f.fundName] = f; return acc; }, {});

const homeTitle = 'Financial Overview';
const getBreadcrumbs = (fundName, companyName) => {
  let res = [homeTitle];
  if (fundName != null) {
    res.push(fundName);
  }
  if (companyName != null) {
    // TODO
  }
  return res;
};

const Dashboard = () => {
  const [fundName, setFundName] = useState(null);
  const [filter, setFilter] = useState('ALL');

  const fund = fundName ? FUNDS_BY_NAME[fundName] : null;
  const filteredPeriod = FILTERS.find(f => f.label === filter).period;
  const breadcrumbs = getBreadcrumbs(fundName);

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
    if (fund != null) {
      // fund view
      res = { [fund.fundName]: lastPeriod(filteredPeriod, fund.investmentRoundsSummary) };
    } else {
      // home view
      res = FUNDS.reduce((acc, f) => {
        acc[f.fundName] = lastPeriod(filteredPeriod, f.investmentRoundsSummary);
        return acc;
      }, {});
    }

    return toChartData(res);
  }, [fund, filteredPeriod]);

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
    if (fund != null) {
      res = fund.investments;
    } else {
      res = FUNDS.map(({ fundName, investmentRoundsSummary }) => ({
        fundName,
        investmentRoundsSummary
      }));
    }
    return res;
  }, [fund]);

  return (
    <StyledDashboard>
      <HeaderBar
        breadcrumbs={breadcrumbs}
        onBreadcrumbClick={setFundName}
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
        filteredPeriod={filteredPeriod}
        fundName={fundName}
        onSelectedFund={setFundName}
      />
    </StyledDashboard>
  );
};

export default Dashboard;
