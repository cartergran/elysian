import Box, { boxClasses } from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import styled from 'styled-components';

import Logo from './logo';

import api from '../utils/client';
import { useAuth } from '../context/auth';

const LOGIN_LABELS = {
  wordmark: 'Panorama',
  username: 'Username',
  password: 'Password',
  signIn: 'Sign In',
  errors: {
    invalidCredentials: 'Invalid username or password.',
    generic: 'Something went wrong. Please try again.'
  }
};

const StyledLogin = styled.div`
  ${({ theme }) => theme.recycle.flexCenter};
  min-height: 100vh;
  background-color: ${({ theme }) => theme.palette.background.default};

  ${({ theme }) => theme.breakpoints.up('md')} {
    min-height: 100dvh;
  }
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 360px;
`;

const LoginBrand = styled.div`
  ${({ theme }) => theme.recycle.flexCenter};
  gap: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(3)};

  .${boxClasses.root} {
    width: 60px;
    height: 60px;
  }
`;

const Wordmark = styled(Typography)`
  color: ${({ theme }) => theme.palette.primary.main};
  font-family: 'Roboto Mono', monospace;
  font-weight: 700;
  font-size: ${({ theme }) => theme.typography.h4.fontSize};
  letter-spacing: 0.1em;
  text-align: center;
`;

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isSubmitDisabled = !username || !password || loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { username, password });
      login(data.token);
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        setError(LOGIN_LABELS.errors.invalidCredentials);
      } else {
        setError(LOGIN_LABELS.errors.generic);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledLogin>
      <LoginCard elevation={2}>
        <CardContent sx={{ p: 4 }}>
          <LoginBrand>
            <Logo size={60} />
            <Wordmark>{LOGIN_LABELS.wordmark}</Wordmark>
          </LoginBrand>
          <Box
            component="form"
            display="flex"
            flexDirection="column"
            gap={2}
            onSubmit={handleSubmit}
          >
            <TextField
              autoFocus
              disabled={loading}
              fullWidth
              label={LOGIN_LABELS.username}
              size="small"
              value={username}
              variant="outlined"
              slotProps={{ htmlInput: error ? { 'aria-describedby': 'login-error' } : {} }}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              disabled={loading}
              label={LOGIN_LABELS.password}
              fullWidth
              size="small"
              type="password"
              value={password}
              variant="outlined"
              slotProps={{ htmlInput: error ? { 'aria-describedby': 'login-error' } : {} }}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <Typography
                id="login-error"
                color="error"
                role="alert"
                variant="caption"
              >
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              disabled={isSubmitDisabled}
              fullWidth
              sx={{ mt: 1 }}
              variant="contained"
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : LOGIN_LABELS.signIn}
            </Button>
          </Box>
        </CardContent>
      </LoginCard>
    </StyledLogin>
  );
};

export default Login;
