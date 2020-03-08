import React, { useState } from 'react';
import {
  Paper, Button, makeStyles, Grid,
} from '@material-ui/core';

import UserCard from './UserCard';

const useStyles = makeStyles({
  userListContainer: {
    padding: '10px',
  },
});

interface User {
  id: number;
  first_name: string;
  last_name: string;
  status: string;
  created_at: string;
  updated_at: string;
  url: string;
}

export interface UserListProps {
  users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  const classes = useStyles();
  const USERS_PER_PAGE = 10;
  const [actualPage, setActualPage] = useState(53);
  const showPage = actualPage + 1;
  const totalPages = Math.ceil(users.length / USERS_PER_PAGE); // TODO remainder users

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
      <Grid item key={user.id}>
        <UserCard user={user} />
      </Grid>
    ));
  };

  return (
    <Paper>
      <Grid container spacing={2}>
        {users.length > 0 && renderUserCards()}
      </Grid>
      {users.length > 0
        && `${users.length} users. Showing ${USERS_PER_PAGE}/page. Total pages: ${totalPages}`}
      <Button onClick={() => stepPagination('down')}>Previous</Button>
      {users.length > 0 && `page ${showPage} / ${totalPages}`}
      <Button onClick={() => stepPagination('up')}>Next</Button>
    </Paper>
  );
};

export default UserList;
