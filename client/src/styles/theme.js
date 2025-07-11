import { createTheme } from '@mui/material';
import { css } from 'styled-components';

const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#552583', // lakers purple
      light: '#8151B9'
    },
    secondary: {
      main: '#FDB927' // lakers gold
    },
    action: {
      disabled: '#A0A0A0'
    }
  },
  typography: {
    fontFamily: 'Roboto'
  },
  shape: {
    borderRadius: 8
  }
});

const extendedMuiTheme = createTheme(muiTheme, {
  components: {
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderColor: muiTheme.palette.secondary.main,
          borderRadius: muiTheme.shape.borderRadius,
          color: muiTheme.palette.secondary.main,
          '&.Mui-selected': {
            backgroundColor: muiTheme.palette.primary.main,
            color: muiTheme.palette.secondary.main,
            '&:hover': {
              backgroundColor: muiTheme.palette.primary.light
            }
          }
        }
      }
    }
  }
});

const recycle = {
  flexCenter: css`
    display: flex;
    justify-content: center;
    align-items: center;
  `
};

const theme = {
  ...extendedMuiTheme,
  recycle
};

export default theme;
