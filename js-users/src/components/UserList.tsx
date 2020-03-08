import React, { useState } from 'react';
import {
  Paper, Button, makeStyles, Grid, CircularProgress,
} from '@material-ui/core';

import { User } from '../types/User';
import UserCard from './UserCard';

const useStyles = makeStyles({
  userListContainer: {
    width: '100%',
    height: '100%',
    padding: '16px',
  },
  spinnerGrid: {
    height: '500px',
  },
});

export interface UserListProps {
  users: User[];
  onStatusUpdate: (id: number) => void;
  isLoading: boolean;
}

const UserList: React.FC<UserListProps> = ({ users, onStatusUpdate, isLoading }) => {
  const classes = useStyles();
  const USERS_PER_PAGE = 10;
  const [actualPage, setActualPage] = useState(0);
  const showPage = actualPage + 1;
  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);

  const getPagination = () => {
    const start = actualPage * 10;
    const end = start + USERS_PER_PAGE;
    return { start, end };
  };

  const stepPagination = (direction: string) => {
    if (direction === 'up') {
      if (actualPage === totalPages - 1) {
        return;
      }
      setActualPage(actualPage + 1);
    }
    if (direction === 'down') {
      if (actualPage === 0) {
        return;
      }
      setActualPage(actualPage - 1);
    }
  };

  const renderUserCards = () => {
    const pagination = getPagination();
    const actualPageUsers = users.slice(pagination.start, pagination.end);

    return actualPageUsers.map((user) => (
      <Grid item key={user.id} xs={12} sm={6}>
        <UserCard user={user} onStatusUpdate={onStatusUpdate} />
      </Grid>
    ));
  };

  const renderNav = () => (
    <>
      <Button color="secondary" onClick={() => stepPagination('down')}>Previous</Button>
      {`${showPage} / ${totalPages}`}
      <Button color="secondary" onClick={() => stepPagination('up')}>Next</Button>
    </>
  );

  const renderContent = () => {
    if (!isLoading) {
      return (
        <>
          <Grid container alignItems="center" justify="center">
            {renderNav()}
          </Grid>
          <Grid container direction="row" spacing={2}>
            {renderUserCards()}
          </Grid>
        </>
      );
    }
    return (
      <Grid container alignItems="center" justify="center" className={classes.spinnerGrid}>
        <CircularProgress size="12rem" />
      </Grid>
    );
  };

  return (
    <>
      <Paper className={classes.userListContainer} elevation={2}>
        {renderContent()}
      </Paper>
    </>
  );
};

export default UserList;
