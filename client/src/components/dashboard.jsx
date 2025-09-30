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
  const [selectedFilter, setSelectedFilter] = useState(filters['2Y']);

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
      if (selectedFilter != null) {
        res = { [fund.fundName]: fund.investmentRoundsSummary.slice(-selectedFilter) };
      } else {
        res = { [fund.fundName]: fund.investmentRoundsSummary };
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
  }, [selectedFund, selectedFilter]);

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
        filters={filters}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />
      <Portfolio
        portfolioData={portfolioData}
        selectedFund={selectedFund}
        selectedFilter={selectedFilter}
        onSelectedFund={setSelectedFund}
      />
    </StyledDashboard>
  );
};

export default Dashboard;
