import React from 'react';
import { Switch } from 'react-router';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import { makeStyles, Grid, Paper } from '@material-ui/core';

import MuiTheme from './theme/MuiTheme';
import MainPage from './pages/MainPage';
import EditUser from './pages/EditUser';
import AddUser from './pages/AddUser';

const useStyles = makeStyles({
  appContainer: {
    padding: '16px',
    position: 'absolute',
    height: '100vh',
  },
  mainPaper: {
    width: '100%',
    height: '100%',
    padding: '16px',
  },
});

function App() {
  const classes = useStyles();
  return (
    <BrowserRouter>
      <MuiTheme>
        <Grid container justify="center" alignItems="center" className={classes.appContainer}>
          <Grid item xs={12} sm={10} md={8} lg={6}>
            <Paper className={classes.mainPaper} elevation={2}>
              <Switch>
                <Route exact path="/main" component={MainPage} />
                <Route exact path="/main/new" component={AddUser} />
                <Route exact path="/main/edit/:id" component={EditUser} />
                <Route exact path="/" render={() => <Redirect to="/main" />} />
              </Switch>
            </Paper>
          </Grid>
        </Grid>
      </MuiTheme>
    </BrowserRouter>
  );
}

export default App;
