import React, { useState, useEffect } from 'react';
import { makeStyles, CircularProgress } from '@material-ui/core';

import { getUsers } from '../utils/api';
import UserList from '../components/UserList';

const useStyles = makeStyles({
  card: {
    padding: '10px',
  },
});

export interface MainPageProps { }

interface User {
  id: number;
  first_name: string;
  last_name: string;
  status: string;
  created_at: string;
  updated_at: string;
  url: string;
}

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
  return (
    <>
      {isLoading && <CircularProgress />}
      {errorInfo.isError && errorInfo.message ? errorInfo.message : null}
      <UserList users={users} />
    </>
  );
};

export default MainPage;
