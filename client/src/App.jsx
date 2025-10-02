import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyle from './styles/globalStyle';
import theme from './styles/theme';
import { ThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

import Dashboard from './components/dashboard';
import Layout from './components/layout';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <StyledThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyle />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              {/* HOME */}
              <Route path="/" element={<Dashboard />} />
              {/* FUND */}
              <Route path="/fund/:fundSlug" element={<Dashboard />} />
              {/* COMPANY */}
              <Route path="/fund/:fundSlug/company/:companySlug" element={<Dashboard />} />
              {/* TODO: 404 */}
              <Route path="*" element={<h1>ERROR</h1>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </StyledThemeProvider>
    </ThemeProvider>
  );
}

export default App
