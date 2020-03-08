import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import {
  Paper, Box, makeStyles, FormGroup, FormControlLabel, Switch, Button,
} from '@material-ui/core';

import { User } from '../types/User';
import { Error } from '../types/Error';
import { updateUser } from '../utils/api';
import { ErrorMessage } from './ErrorMessage';

const useStyles = makeStyles({
  card: {
    minWidth: 650,
    padding: '10px',
  },
  strikethrough: {
    textDecoration: 'line-through',
  },
});

export interface UserCardProps extends RouteComponentProps {
  user: User;
  onStatusUpdate: (id: number) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onStatusUpdate, history }) => {
  const classes = useStyles();
  const [isLocked, setIsLocked] = useState(user.status === 'locked');
  const [errorInfo, setErrorInfo] = useState<Error>({
    isError: false,
    message: '',
  });

  const handleStatusChange = async () => {
    try {
      const newUser = { ...user };
      newUser.status = isLocked ? 'active' : 'locked';
      const update = await updateUser(newUser);
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

  const renderErrorMessage = () => (
    <>
      <Box>
        {errorInfo.message}
      </Box>
      <Button
        variant="contained"
        onClick={setErrorInfo({
          isError: false,
          message: '',
        })}
      >
        OK :(
      </Button>
    </>
  );

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
      <Button
        variant="contained"
        onClick={() => history.push(`/main/edit/${user.id}`)}
      >
        Edit user
      </Button>
      {errorInfo.isError && renderErrorMessage()}
    </Paper>
  );
};

export default withRouter(UserCard);
