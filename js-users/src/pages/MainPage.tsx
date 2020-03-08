import React, { useState, useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { makeStyles, CircularProgress, Fab } from '@material-ui/core';
import { Add } from '@material-ui/icons';

import { getUsers, getUserById } from '../utils/api';
import { User } from '../types/User';
import { ErrorInfo } from '../types/ErrorInfo';
import UserList from '../components/UserList';

const useStyles = makeStyles({
  card: {
    padding: '10px',
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

  const findUserById = (id: number) => {
    const selectedUser = users.find((user) => user.id === id);
    console.log('selectedUser', selectedUser);
  };

  return (
    <>
      {isLoading && <CircularProgress />}
      {errorInfo.isError && errorInfo.message ? errorInfo.message : null}
      <Fab color="primary" onClick={() => history.push('/main/new')}>
        <Add fontSize="large" />
      </Fab>
      <UserList users={users} onStatusUpdate={updateUserById} />
    </>
  );
};

export default withRouter(MainPage);
