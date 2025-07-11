import styled from 'styled-components';
import Chart from './chart';
import Filter from './filter';

import FundA from '../reports/fundA.json';

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
      <Chart report={FundA.companyA} />
      <Filter />
    </StyledDashboard>
  );
};

export default Dashboard;
