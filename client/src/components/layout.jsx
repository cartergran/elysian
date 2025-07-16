import styled from 'styled-components';

const StyledLayout = styled.div`
  width: 100%;
  min-height: 100dvh;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
`;

const Layout = ({ children }) => {
  return (
    <StyledLayout>
      <main>
        { children }
      </main>
    </StyledLayout>
  );
};

export default Layout;
