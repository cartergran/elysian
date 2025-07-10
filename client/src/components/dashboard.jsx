import styled from 'styled-components';
import Chart from './chart';
import FundA from '../reports/fundA.json';

const StyledDashboard = styled.div`
  ${({ theme }) => theme.recycle.flexCenter};

  width: 100%;

  padding: var(--space-xl);
`;

const Dashboard = () => {
  return (
    <StyledDashboard>
      <Chart report={FundA.companyA} />
    </StyledDashboard>
  );
};

export default Dashboard;
