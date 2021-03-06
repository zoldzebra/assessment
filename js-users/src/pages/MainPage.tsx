import React, { useState, useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { makeStyles, Fab, Grid } from '@material-ui/core';
import { Add } from '@material-ui/icons';

import { getUsers, getUserById } from '../utils/api';
import { User } from '../types/User';
import { ErrorInfo } from '../types/ErrorInfo';
import UserList from '../components/UserList';

const useStyles = makeStyles({
  card: {
    padding: '16px',
  },
  addButton: {
    position: 'absolute',
    top: '2vh',
    right: '2vw',
  },
});

export type MainPageProps = RouteComponentProps

const MainPage: React.FC<MainPageProps> = ({ history }) => {
  const classes = useStyles();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState<ErrorInfo>({
    isError: false,
    message: '',
  });

  useEffect(() => {
    const queryUsers = async () => {
      try {
        setIsLoading(true);
        const result = await getUsers();
        setUsers([...result]);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setErrorInfo({
          isError: true,
          message: error.message,
        });
      }
    };
    queryUsers();
  }, []);

  const updateUserById = async (id: number) => {
    const updatedUser = await getUserById(id);
    const oldUserIndex = users.findIndex((user) => user.id === id);
    const newUsers = [...users];
    newUsers[oldUserIndex] = Object.assign(newUsers[oldUserIndex], updatedUser);
    setUsers(newUsers);
  };

  const renderContent = () => {
    if (errorInfo.isError) {
      return (
        <Grid container alignItems="center" justify="center">
          {errorInfo.message}
        </Grid>
      );
    }
    return (
      <>
        <Fab color="primary" onClick={() => history.push('/main/new')} className={classes.addButton}>
          <Add fontSize="large" />
        </Fab>
        <UserList users={users} onStatusUpdate={updateUserById} isLoading={isLoading} />
      </>
    );
  };

  return (
    <>
      {renderContent()}
    </>
  );
};

export default withRouter(MainPage);
