import { createTheme } from '@mui/material';
import { css } from 'styled-components';

const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#552583', // lakers purple
      light: '#8151B9'
    },
    secondary: {
      main: '#FDB927', // lakers gold
      light: '#FED76D'
    },
    text: {
      primary: '#FDB927'
    },
    action: {
      disabled: '#A0A0A0',
      highlighted: '#2A2A2A'
    },
    chartLines: [
      '#aec7e8',
      '#ffbb78',
      '#98df8a',
      '#ff9896',
      '#c5b0d5',
      '#c49c94',
      '#f7b6d2',
      '#c7c7c7',
      '#dbdb8d',
      '#9edae5'
    ]
  },
  chart: {
    dot: {
      r: 1,
      rActive: 2
    },
    legend: {
      fontSize: 14,
      opacityInactive: 0.5
    },
    line: {
      opacityInactive: 0.25,
      width: 2,
      widthActive: 4
    }
  },
  shape: {
    borderWidth: 1,
    borderRadius: 8
  },
  spacing: 8,
  typography: {
    fontFamily: 'Roboto Mono, monospace'
  }
});

const extendedMuiTheme = createTheme(muiTheme, {
  components: {
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderColor: muiTheme.palette.secondary.main,
          borderWidth: muiTheme.shape.borderWidth,
          borderRadius: muiTheme.shape.borderRadius,
          color: muiTheme.palette.secondary.main,
          '&:hover': {
            backgroundColor: muiTheme.palette.action.disabled
          },
          '&.Mui-selected': {
            backgroundColor: muiTheme.palette.primary.main,
            color: muiTheme.palette.secondary.main,
            '&:hover': {
              backgroundColor: muiTheme.palette.primary.light
            }
          }
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 700,
            letterSpacing: '0.5px'
          }
        }
      }
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: muiTheme.palette.primary.light,
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
