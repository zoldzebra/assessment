import React from 'react';
import { MuiThemeProvider } from '@material-ui/core';

import theme from './theme';

const MuiTheme: React.FC<{}> = ({ children }) => (
  <MuiThemeProvider theme={theme}>
    {children}
  </MuiThemeProvider>
);

export default MuiTheme;
