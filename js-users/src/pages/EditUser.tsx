/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useEffect, ChangeEvent } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import {
  Paper, Button, FormControl, Input,
} from '@material-ui/core';

import { getUserById, updateUser, API } from '../utils/api';
import { User } from '../types/User';
import { ErrorInfo } from '../types/ErrorInfo';
import ErrorMessage from '../components/ErrorMessage';

interface RouteParams {
  id: string;
}

export type EditUserProps = RouteComponentProps<RouteParams>

const EditUser: React.FC<EditUserProps> = ({ match, history }) => {
  const emptyState = {
    id: -1,
    first_name: '',
    last_name: '',
    status: '',
    created_at: '',
    updated_at: '',
    url: '',
  };
  const [user, setUser] = useState<User>(emptyState);
  const [isLoading, setIsLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState<ErrorInfo>({
    isError: false,
    message: '',
  });
  const { params } = match;
  const { id } = params;

  useEffect(() => {
    const queryUser = async () => {
      try {
        setIsLoading(true);
        const result = await getUserById(Number(id));
        setUser({ ...result });
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setErrorInfo({
          isError: true,
          message: error.message,
        });
      }
    };
    queryUser();
  }, [id]);

  const handleInputs = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'firstName') {
      setUser({ ...user, first_name: value });
    }
    if (name === 'lastName') {
      setUser({ ...user, last_name: value });
    }
  };

  const backToMainPage = () => {
    history.push('/main');
  };

  const handleSave = async () => {
    console.log('handleSave');
    try {
      const saved = await updateUser(user);
      if (saved) {
        backToMainPage();
      }
    } catch (error) {
      setErrorInfo({
        isError: true,
        message: error.message,
      });
    }
  };

  const renderErrorMessage = () => (
    <ErrorMessage
      errorInfo={errorInfo}
      onClick={(_event) => setErrorInfo({
        isError: false,
        message: '',
      })}
    />
  );

  return (
    <Paper>
      Edit user
      <Input name="firstName" value={user?.first_name} onChange={handleInputs} />
      <Input name="lastName" value={user?.last_name} onChange={handleInputs} />
      <Button
        variant="contained"
        onClick={handleSave}
      >
        SAVE!
      </Button>
      <Button
        variant="contained"
        onClick={backToMainPage}
      >
        Back
      </Button>
      {errorInfo.isError && renderErrorMessage()}
    </Paper>
  );
};

export default withRouter(EditUser);
