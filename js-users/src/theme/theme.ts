import createMuiTheme, { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';

export function createAppTheme(options: ThemeOptions) {
  return createMuiTheme({
    typography: {
      fontFamily: 'inherit',
      body1: {
        fontSize: '0.875rem',
      },
    },
    overrides: {
      MuiTableCell: {
        root: {
          padding: 0,
          borderBottomStyle: 'none',
        },
      },
      MuiPaper: {
        rounded: {
          borderRadius: '20px',
        },
      },
    },
    ...options,
  });
}

export default createAppTheme({});
