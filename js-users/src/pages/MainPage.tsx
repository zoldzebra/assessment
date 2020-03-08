import React, { useState, useEffect } from 'react';
import { makeStyles, CircularProgress } from '@material-ui/core';

import { getUsers, getUserById } from '../utils/api';
import { User } from '../types/User';
import UserList from '../components/UserList';

const useStyles = makeStyles({
  card: {
    padding: '10px',
  },
});

export interface MainPageProps { }

const MainPage: React.FC<MainPageProps> = (props) => {
  const classes = useStyles();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState({
    isError: false,
    message: null,
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

  return (
    <>
      {isLoading && <CircularProgress />}
      {errorInfo.isError && errorInfo.message ? errorInfo.message : null}
      <UserList users={users} onStatusUpdate={updateUserById} />
    </>
  );
};

export default MainPage;
