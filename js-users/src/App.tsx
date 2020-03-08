import React from 'react';
import { Switch } from 'react-router';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import { makeStyles, Grid } from '@material-ui/core';

import MainPage from './pages/MainPage';
import EditUser from './pages/EditUser';
import AddUser from './pages/AddUser';

const useStyles = makeStyles({
  appContainer: {
    padding: '10px',
  },
});

function App() {
  const classes = useStyles();
  return (
    <BrowserRouter>
      <Grid container className={classes.appContainer}>
        <Switch>
          <Route exact path="/main" component={MainPage} />
          <Route exact path="/main/new" component={AddUser} />
          <Route exact path="/main/edit/:id" component={EditUser} />
          <Route exact path="/" render={() => <Redirect to="/main" />} />
        </Switch>
      </Grid>
    </BrowserRouter>
  );
}

export default App;
