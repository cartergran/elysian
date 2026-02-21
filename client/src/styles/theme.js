import { alpha, createTheme } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { toggleButtonClasses } from '@mui/material/ToggleButton';
import { css } from 'styled-components';

const muiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1565C0', // trusted blue
      light: '#42A5F5',
      dark: '#0D47A1'
    },
    secondary: {
      main: '#48607E', // blue-slate
      light: '#58729A',
      dark: '#2F4060'
    },
    background: {
      default: '#F5F7FA', // soft off-white
      paper: '#FFFFFF'
    },
    text: {
      primary: '#1A202C',
      secondary: '#64748B',
      disabled: '#94A3B8'
    },
    success: {
      main: '#059669', // positive / gains
      light: '#10B981',
      dark: '#047857'
    },
    error: {
      main: '#DC2626', // negative / losses
      light: '#EF4444',
      dark: '#B91C1C'
    },
    action: {
      disabled: '#94A3B8',
      disabledBackground: alpha('#1565C0', 0.14),
      hover: alpha('#1565C0', 0.10),
      selected: alpha('#1565C0', 0.14)
    },
    divider: '#D4DAE5',
    entities: [
      '#0369A1', // steel blue
      '#0D9488', // teal
      '#047857', // green
      '#6366F1', // indigo
      '#7C3AED', // violet
      '#0891B2', // cyan
      '#B45309', // amber
      '#BE185D', // rose
      '#475569', // slate
      '#0E7490'  // teal-cyan
    ]
  },
  chart: {
    activeDot: {
      radiusDetailed: 6
    },
    line: {
      opacityUnselected: 0.25,
      widthDetailed: 2
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
          borderColor: muiTheme.palette.divider,
          borderWidth: muiTheme.shape.borderWidth,
          borderRadius: muiTheme.shape.borderRadius,
          color: muiTheme.palette.text.secondary,
          '&:hover': {
            backgroundColor: muiTheme.palette.action.hover
          },
          [`&.${toggleButtonClasses.selected}`]: {
            backgroundColor: muiTheme.palette.primary.main,
            color: muiTheme.palette.background.paper,
            borderColor: muiTheme.palette.primary.main,
            '&:hover': {
              backgroundColor: muiTheme.palette.primary.dark
            }
          }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottomColor: muiTheme.palette.divider
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          [`& .${tableCellClasses.head}`]: {
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
