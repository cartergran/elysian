import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

const StyledLayout = styled.div`
  width: 100%;
  min-height: 100dvh;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
`;

const Layout = () => {
  return (
    <StyledLayout>
      <main>
        <Outlet />
      </main>
    </StyledLayout>
  );
};

export default Layout;
