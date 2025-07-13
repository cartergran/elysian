import styled from 'styled-components';
import Chart from './chart';
import Filter from './filter';
import Portfolio from './portfolio'

import fundA from '../reports/fundA.json';
import mockReport from '../reports/mockReport.json';

const StyledDashboard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-m);

  width: 100%;

  padding: var(--space-xl);
`;

const Dashboard = () => {

  return (
    <StyledDashboard>
      <Chart report={fundA.companyA} />
      <Filter />
      <Portfolio report={mockReport.investments} />
    </StyledDashboard>
  );
};

export default Dashboard;
