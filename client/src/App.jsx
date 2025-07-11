import theme from './styles/theme';
import GlobalStyle from './styles/globalStyle';
import { ThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import CssBaseline from '@mui/material/CssBaseline';

import Layout from './components/layout';
import Dashboard from './components/dashboard';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <StyledThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyle />
        <Layout>
          <Dashboard />
        </Layout>
      </StyledThemeProvider>
    </ThemeProvider>
  );
}

export default App
