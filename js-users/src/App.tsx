import React from 'react';
import { Switch } from 'react-router';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';

import MainPage from './pages/MainPage';
import EditUser from './pages/EditUser';
import AddUser from './pages/AddUser';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/main" component={MainPage} />
        <Route exact path="/main/new" component={AddUser} />
        <Route exact path="/main/edit/:id" component={EditUser} />
        <Route exact path="/" render={() => (<Redirect to="/main" />)} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
