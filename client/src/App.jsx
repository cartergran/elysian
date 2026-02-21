import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyle from './styles/globalStyle';
import theme from './styles/theme';
import { ThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider, useAuth } from './context/auth';
import Dashboard from './components/dashboard';
import Layout from './components/layout';
import Login from './components/Login';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false
    }
  }
});

const AppRoutes = () => {
  const { token } = useAuth();

  if (!token) {
    return <Login />;
  }

  return (
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
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <StyledThemeProvider theme={theme}>
          <CssBaseline />
          <GlobalStyle />
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </StyledThemeProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
