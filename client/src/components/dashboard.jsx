import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import Chart from './chart';
import Filter from './filter';
import Header from './header';
import Portfolio from './portfolio';

import { slugify, deslugify } from '../utils/helpers';
import { toChartData } from '../utils/investments';

import fundA from '../reports/nexacoreGrowthEquityFund.json';
import fundB from '../reports/polarisFutureVenturesFund.json';
import fundC from '../reports/vertexEdgeOpportunityFund.json';

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

const HOME_TITLE = 'Financial Overview';

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

const Dashboard = () => {
  const nav = useNavigate();
  const { fundSlug, companySlug } = useParams();
  const [chartCompanies, setChartCompanies] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState(Infinity);
  const [selectedColumn, setSelectedColumn] = useState(DEFAULT_COLUMN);

  const fundName = fundSlug ? deslugify(fundSlug, FUNDS) : null;
  const fund = fundName ? FUNDS_BY_NAME[fundName] : null;
  const companyName = companySlug && fund ? deslugify(companySlug, FUNDS, fund) : null;

  const crumbs = useMemo(() => {
    let res = [HOME_TITLE];
    if (fundName != null) { res.push(fundName); }
    if (companyName != null) { /* TODO */ }
    return res;
  }, [fundName, companyName]);
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
    let res = {};
    if (view.mode === 'FUND') {
      // fund view
      res = chartCompanies
        ? fund.investments.reduce((acc, i) => {
            acc[i.companyName] = lastPeriod(filterPeriod, i.investmentRounds);
            return acc;
          }, {})
        : { [fund.fundName]: lastPeriod(filterPeriod, fund.investmentRoundsSummary) };
    } else {
      // home view
      res = FUNDS.reduce((acc, f) => {
        acc[f.fundName] = lastPeriod(filterPeriod, f.investmentRoundsSummary);
        return acc;
      }, {});
    }

    return toChartData(res, selectedColumn.dataPoint);
  }, [chartCompanies, filterPeriod, fund, selectedColumn, view]);

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
    if (view.mode === 'FUND') {
      res = fund.investments;
    } else {
      res = FUNDS.map(({ fundName, investmentRoundsSummary }) => ({
        fundName,
        investmentRoundsSummary
      }));
    }
    return res;
  }, [fund, view]);

  const handleCrumbClick = (idx) => {
    setChartCompanies(false);
    setSelectedColumn(DEFAULT_COLUMN);
    navByIdx[idx]();
  };

  return (
    <StyledDashboard>
      <Header
        chartCompanies={chartCompanies}
        crumbs={crumbs}
        view={view}
        onCrumbClick={handleCrumbClick}
        onSwitchChange={(e) => setChartCompanies(e.target.checked)}
      />
      <Chart
        chartData={chartData}
        yLabel={selectedColumn.title}
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
