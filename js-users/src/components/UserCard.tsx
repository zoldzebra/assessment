import React from 'react';
import { Paper, Box } from '@material-ui/core';

export interface UserCardProps {
  firstName: string;
  lastName: string;
  status: string;
}

const UserCard: React.FC<UserCardProps> = ({
  firstName,
  lastName,
  status
}) => (
    <Paper>
      <Box>{firstName}</Box>
      <Box>{lastName}</Box>
      <Box>{status}</Box>
    </Paper>
  );

export default UserCard;