import { useState } from 'react';
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
  const [selectedFilter, setSelectedFilter] = useState(null);

  return (
    <StyledDashboard>
      <Chart
        funds={funds}
        selectedFilter={selectedFilter}
      />
      <Filter
        filters={filters}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />
      <Portfolio report={mockReport.investments} />
    </StyledDashboard>
  );
};

export default Dashboard;
