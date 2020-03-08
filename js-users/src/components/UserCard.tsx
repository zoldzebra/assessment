import React from 'react';
import { Paper, Box, makeStyles } from '@material-ui/core';

import { User } from '../types/User';

const useStyles = makeStyles({
  card: {
    minWidth: 650,
    padding: '10px',
  },
});

export interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.card}>
      <Box>{`id: ${user.id}`}</Box>
      <Box>{user.first_name}</Box>
      <Box>{user.last_name}</Box>
      <Box>{user.status}</Box>
    </Paper>
  );
};

export default UserCard;
