import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import Chart from './chart';
import Filter from './filter';
import Header from './header';
import Portfolio from './portfolio';

import { slugify, deslugify } from '../utils/helpers';
import { toChartData } from '../utils/investments';
import { useFunds } from '../hooks/funds';

// TODO: tmp
// import fundA from '../reports/nexacoreGrowthEquityFund.json';
// import fundB from '../reports/polarisFutureVenturesFund.json';
// import fundC from '../reports/vertexEdgeOpportunityFund.json';
// const funds = [fundA, fundB, fundC];

const StyledDashboard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};

  width: 100%;

  padding: ${({ theme }) => theme.spacing(4)};
`;

const DEFAULT_COLUMN = {
  idx: 1,
  title: 'Total Value',
  dataPoint: 'totalValue'
};

const FILTERS = [
  { label: '1Q', period: 1 },
  { label: '2Q', period: 2 },
  { label: '1Y', period: 4 },
  { label: '2Y', period: 8 },
  { label: 'ALL', period: Infinity }
];
const lastPeriod = (p, arr) => p === Infinity ? arr : arr.slice(-(p + 1));

const Dashboard = () => {
  const { fundSlug, companySlug } = useParams();
  const nav = useNavigate();
  // TODO: loading, isError, error
  const { data: funds = [], isLoading: loading, isError, error } = useFunds();

  const [chartCompanies, setChartCompanies] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState(Infinity);
  const [selectedColumn, setSelectedColumn] = useState(DEFAULT_COLUMN);

  const FUNDS_BY_NAME = useMemo(() => (
    funds.reduce((acc, f) => { acc[f.fundName] = f; return acc; }, {})
  ), [funds]);

  const fundName = fundSlug ? deslugify(fundSlug, funds) : null;
  const fund = fundName ? FUNDS_BY_NAME[fundName] : null;
  const companyName = companySlug && fund ? deslugify(companySlug, funds, fund) : null;

  const view = useMemo(() => {
    if (fundName && companyName) { return { mode: 'COMPANY', params: { fundName, companyName } }; }
    if (fundName) { return { mode: 'FUND', params: { fundName } } };
    return { mode: 'HOME', params: {} };
  }, [fundName, companyName]);

  const goHome = () => nav('/');
  const goFund = (f) => nav(`/fund/${slugify(f)}`);
  const goCompany = (f, c) => nav(`/fund/${slugify(f)}/company/${slugify(c)}`);
  const navByIdx = {
    0: goHome,
    1: goFund,
    2: goCompany
  };

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
    let retVal = {};
    if (view.mode === 'FUND') {
      // fund view
      retVal = chartCompanies
        ? fund.investments.reduce((acc, i) => {
            acc[i.companyName] = lastPeriod(filterPeriod, i.investmentRounds);
            return acc;
          }, {})
        : { [fund.fundName]: lastPeriod(filterPeriod, fund.investmentRoundsSummary) };
    } else {
      // home view
      retVal = funds.reduce((acc, f) => {
        acc[f.fundName] = lastPeriod(filterPeriod, f.investmentRoundsSummary);
        return acc;
      }, {});
    }

    return toChartData(retVal, selectedColumn.dataPoint);
  }, [chartCompanies, filterPeriod, fund, funds, selectedColumn, view]);

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
    let retVal = [];
    if (view.mode === 'FUND') {
      retVal = fund.investments;
    } else {
      retVal = funds.map(({ fundName, investmentRoundsSummary }) => ({
        fundName,
        investmentRoundsSummary
      }));
    }

    return retVal;
  }, [fund, funds, view]);

  const handleCrumbClick = (idx) => {
    setChartCompanies(false);
    setSelectedColumn(DEFAULT_COLUMN);
    navByIdx[idx]();
  };

  return (
    <StyledDashboard>
      <Header
        fundName={fundName}
        view={view}
        onCrumbClick={handleCrumbClick}
        onSwitchChange={(e) => setChartCompanies(e.target.checked)}
      />
      <Chart
        chartData={chartData}
        dataLabel={selectedColumn.title}
      />
      <Filter
        options={FILTERS}
        selected={filterPeriod}
        onChange={setFilterPeriod}
      />
      <Portfolio
        portfolioData={portfolioData}
        filterPeriod={filterPeriod}
        selectedColumn={selectedColumn}
        view={view}
        onColumnHeaderClick={(idx, title, dataPoint) => setSelectedColumn({ idx, title, dataPoint })}
        onFundNameClick={(fundName) => { setSelectedColumn(DEFAULT_COLUMN); goFund(fundName); }}
      />
    </StyledDashboard>
  );
};

export default Dashboard;
