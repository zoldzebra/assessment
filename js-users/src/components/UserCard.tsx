import React from 'react';
import { Paper, Box, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  card: {
    minWidth: 650,
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
