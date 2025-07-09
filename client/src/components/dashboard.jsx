import styled from 'styled-components';

const StyledDashboard = styled.div`
  ${({ theme }) => theme.recycle.flexCenter};
`;

const Dashboard = () => {
  return (
    <StyledDashboard>
      $
    </StyledDashboard>
  );
};

export default Dashboard;
