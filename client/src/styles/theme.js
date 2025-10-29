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
    dotR: 1,
    dotRActive: 2,
    legendOpacityInactive: 0.5,
    lineWidth: 2,
    lineWidthActive: 4,
    lineOpacityInactive: 0.25
  },
  shape: {
    borderWidth: 1,
    borderRadius: 8
  },
  spacing: 8,
  typography: {
    fontFamily: 'Roboto',
    tick: {
      small: { fontSize: '0.75rem' },
      large: { fontSize: '0.875rem' }
    }
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
