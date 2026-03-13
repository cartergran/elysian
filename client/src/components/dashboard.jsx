import styled from 'styled-components';
import { useCallback, useMemo, useState } from 'react';
import { useMediaQuery } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom'
import { useTheme } from '@mui/material/styles';;

import Chart from './chart';
import Filter from './filter';
import Header from './header';
import Portfolio from './portfolio';

import { calcReturnPercent, toChartData } from '../utils/investments';
import { COLUMN_HEADERS_BY_DATA_POINT, DEFAULT_SELECTED_COLUMN, DEFAULT_SORT_COLUMN } from '../utils/portfolio';
import { slugify, deslugify } from '../utils/helpers';
import { useFunds } from '../hooks/funds';

// TODO: tmp
// import fundA from '../reports/blueOrbitCapitalFund.json';
// import fundB from '../reports/fractalHorizonVenturesFund.json';
// import fundC from '../reports/pinnacleAscendFund.json';
// const funds = [fundA, fundB, fundC];

const StyledDashboard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};

  width: 100%;

  padding: ${({ theme }) => theme.spacing(4)};
`;

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // TODO: loading, isError, error
  const { data: funds = [], isLoading: loading, isError, error } = useFunds();

  const [chartCompanies, setChartCompanies] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState(Infinity);
  const [mobileColumn, setMobileColumn] = useState(DEFAULT_SORT_COLUMN);
  const [selectedColumn, setSelectedColumn] = useState(DEFAULT_SELECTED_COLUMN);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [sortColumn, setSortColumn] = useState(DEFAULT_SORT_COLUMN);

  const FUNDS_BY_NAME = useMemo(() => (
    funds.reduce((acc, f) => { acc[f.fundName] = f; return acc; }, {})
  ), [funds]);

  const fundName = fundSlug ? deslugify(fundSlug, funds) : null;
  const fund = fundName ? FUNDS_BY_NAME[fundName] : null;
  const companyName = companySlug && fund ? deslugify(companySlug, funds, fund) : null;

  const view = useMemo(() => {
    if (fundName && companyName) {
      return { mode: 'COMPANY', params: { fundName, companyName } };
    }
    if (fundName) {
      return { entityName: 'company', mode: 'FUND', params: { fundName } }
    };
    return { entityName: 'fund', mode: 'HOME', params: {} };
  }, [fundName, companyName]);

  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [prevViewMode, setPrevViewMode] = useState(view.mode);
  if (view.mode !== prevViewMode) {
    setMobileColumn(DEFAULT_SORT_COLUMN);
    setPrevViewMode(view.mode);
    setSortColumn(DEFAULT_SORT_COLUMN);
  }

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

    const descendingBy = (getVal) => (a, b) => (getVal(b) ?? 0) - (getVal(a) ?? 0);
    const sortValue = (round) => {
      if (sortColumn === 'returnPercent') {
        // TODO: not calc'd or stored in API
        return calcReturnPercent(round.totalValue, round.investedCapital);
      }
      return round[sortColumn];
    };

    if (view.mode === 'FUND') {
      retVal = [...fund.investments].sort(
        // at(-1) := last investment round
        descendingBy((i) => sortValue(i.investmentRounds.at(-1)))
      );
    } else {
      retVal = funds
        .map(({ fundName, investmentRoundsSummary }) => ({ fundName, investmentRoundsSummary }))
        // at(-1) := last investment round summary
        .sort(descendingBy((f) => sortValue(f.investmentRoundsSummary.at(-1))));
    }

    return retVal;
  }, [fund, funds, sortColumn, view]);

  // entity list for selection
  const initialEntities = useMemo(() => {
    let retVal = [];
    if (view.mode === 'FUND') {
      if (fund) {
        retVal = chartCompanies ? fund.investments.map((i) => i.companyName) : [fund.fundName];
      }
    } else {
      retVal = funds.map((f) => f.fundName);
    }

    return retVal;
  }, [chartCompanies, fund, funds, view]);

  const [hoveredEntity, setHoveredEntity] = useState(null);
  const [newEntities, setNewEntities] = useState(true);
  const [selectedEntities, setSelectedEntities] = useState(() => new Set(initialEntities));
  const [prevInitialEntities, setPrevInitialEntities] = useState(initialEntities);
  if (initialEntities !== prevInitialEntities) {
    setPrevInitialEntities(initialEntities);
    setSelectedEntities(new Set(initialEntities));
    setNewEntities(true);
  }

  const selectedSwitchDisabled =
    selectedEntities.size === initialEntities.length  || selectedEntities.size === 0;

  const visibleEntities = useMemo(() => {
    if (!hoveredEntity) {
      return selectedEntities;
    }
    const next = new Set(selectedEntities);
    next.add(hoveredEntity);
    return next;
  }, [hoveredEntity, selectedEntities]);

  const handleSortChange = useCallback((column) => {
    setSortColumn(column);
    if (column !== 'returnPercent') {
      setMobileColumn(column);

      if (isMobile) {
        const headers = COLUMN_HEADERS_BY_DATA_POINT[view.mode] || {};
        const columnKeys = Object.keys(headers);
        setSelectedColumn({ idx: columnKeys.indexOf(column), title: headers[column], dataPoint: column });
      }
    }
  }, [isMobile, view.mode]);

  const handleCrumbClick = useCallback((idx) => {
    setChartCompanies(false);
    setSelectedColumn(DEFAULT_SELECTED_COLUMN);
    navByIdx[idx]();
  }, [navByIdx]);

  const handleFundNameClick = useCallback((fundName) => {
    setSelectedColumn(DEFAULT_SELECTED_COLUMN);
    goFund(fundName);
  }, [goFund]);

  const handleToggleRow = useCallback((entityName) => {
    setSelectedEntities(prev => {
      // if all entities are selected, only select the clicked entity
      if (prev.size === initialEntities.length) {
        return new Set([entityName]);
      }
      // otherwise, toggle the entity
      const next = new Set(prev);
      next.has(entityName) ? next.delete(entityName) : next.add(entityName);
      return next;
    });
    setNewEntities(false);
  }, [initialEntities]);

  const handleToggleRows = useCallback((entityNames) => {
    setSelectedEntities((prev) => {
      return prev.size === entityNames.length ? new Set() : new Set(entityNames)
    });
    setNewEntities(false);
  }, []);

  // TODO: contracts.ts --> useMemo<PortfolioModel>(...)
  const model = useMemo(() => ({
    chartCompanies,
    filterPeriod,
    mobileColumn,
    portfolioData,
    selectedColumn,
    selectedEntities,
    showSelectedOnly,
    sortColumn,
    visibleEntities
  }), [
    chartCompanies,
    filterPeriod,
    mobileColumn,
    portfolioData,
    selectedColumn,
    selectedEntities,
    showSelectedOnly,
    sortColumn,
    visibleEntities
  ]);

  const controller = useMemo(() => ({
    onColumnHeaderClick: setSelectedColumn,
    onFundNameClick: handleFundNameClick,
    onHoverRow: setHoveredEntity,
    onSortChange: handleSortChange,
    onToggleRow: handleToggleRow,
    onToggleRows: handleToggleRows
  }), [
    handleFundNameClick,
    handleSortChange,
    handleToggleRow,
    handleToggleRows
  ]);

  return (
    <StyledDashboard>
      <Header
        chartCompanies={chartCompanies}
        fundName={fundName}
        selectedSwitchDisabled={selectedSwitchDisabled}
        view={view}
        onCrumbClick={handleCrumbClick}
        onSelectedSwitchChange={(e) => setShowSelectedOnly(e.target.checked)}
        onSwitchChange={(e) => setChartCompanies(e.target.checked)}
      />
      <Chart
        chartData={chartData}
        dataLabel={selectedColumn.title}
        newEntities={newEntities}
        selectedEntities={selectedEntities}
        showSelectedOnly={showSelectedOnly}
        visibleEntities={visibleEntities}
      />
      <Filter
        options={FILTERS}
        selected={filterPeriod}
        onChange={setFilterPeriod}
      />
      <Portfolio
        model={model}
        view={view}
        controller={controller}
      />
    </StyledDashboard>
  );
};

export default Dashboard;
