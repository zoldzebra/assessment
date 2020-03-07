import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@material-ui/core';

import { getUsers } from '../utils/api';
import UserCard from '../components/UserCard';

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

const MainPage: React.FC<MainPageProps> = props => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState({
    isError: false,
    message: null
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
          message: error.message
        });
      }
    };
    queryUsers();
  }, []);

  console.log('users', users);

  const renderUsers = () => {
    return users.map(user => (
      <UserCard
        key={user.url}
        firstName={user.first_name}
        lastName={user.last_name}
        status={user.status}
      />
    ));
  };

  return (
    <>
      {isLoading && (<CircularProgress />)}
      {errorInfo.isError && errorInfo.message ? errorInfo.message : null}
      {users.length > 0 && renderUsers()}
    </>
  );
};

export default MainPage;