import React, { useState } from 'react';
import { Paper, Box, makeStyles, FormGroup, FormControlLabel, Switch, Button } from '@material-ui/core';

import { User } from '../types/User';
import { updateStatus } from '../utils/api';

const useStyles = makeStyles({
  card: {
    minWidth: 650,
    padding: '10px',
  },
  strikethrough: {
    textDecoration: 'line-through',
  },
});

export interface UserCardProps {
  user: User;
  onStatusUpdate: (id: number) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onStatusUpdate }) => {
  const classes = useStyles();
  const [isLocked, setIsLocked] = useState(user.status === 'locked');
  const [errorInfo, setErrorInfo] = useState({
    isError: false,
    message: null,
  });

  const handleStatusChange = async () => {
    try {
      const newUser = { ...user };
      newUser.status = isLocked ? 'active' : 'locked';
      const update = await updateStatus(newUser);
      if (update) {
        setIsLocked(!isLocked);
        onStatusUpdate(user.id);
      }
    } catch (error) {
      setErrorInfo({
        isError: true,
        message: error.message,
      });
    }
  };

  const renderErrorMessage = () => {
    return (
      <>
        <Box>
          {errorInfo.message}
        </Box>
        <Button
          variant="contained"
          onClick={() => setErrorInfo({
            isError: false,
            message: null,
          })}
        >
          {`OK :(`}
        </Button>
      </>
    );
  };

  return (
    <Paper className={classes.card}>
      <Box className={`${isLocked && classes.strikethrough}`}>{`${user.id}`}</Box>
      <Box className={`${isLocked && classes.strikethrough}`}>{`${user.first_name} ${user.last_name}`} </Box>
      <FormGroup>
        <FormControlLabel
          label={user.status}
          control={
            (
              <Switch
                checked={!isLocked}
                onChange={handleStatusChange}
                color="primary"
              />
            )
          }
        />
      </FormGroup>
      {errorInfo.isError && renderErrorMessage()}
    </Paper>
  );
};

export default UserCard;
