/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useEffect, ChangeEvent } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { getUserById, updateUser } from '../utils/api';
import { User } from '../types/User';
import { ErrorInfo } from '../types/ErrorInfo';
import ErrorMessage from '../components/ErrorMessage';
import AddOrEditUserForm from '../components/AddOrEditUserForm';

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
  const [errorInfo, setErrorInfo] = useState<ErrorInfo>({
    isError: false,
    message: '',
  });
  const { params } = match;
  const { id } = params;

  useEffect(() => {
    const queryUser = async () => {
      try {
        const result = await getUserById(Number(id));
        setUser({ ...result });
      } catch (error) {
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

  const handleSave = async () => {
    console.log('handleSave');
    try {
      const saved = await updateUser(user);
      if (saved) {
        history.push('/main');
      } else {
        setErrorInfo({
          isError: true,
          message: 'Something went wrong while saving, try again after reload.',
        });
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
    <>
      <AddOrEditUserForm
        title="Edit user"
        firstName={user.first_name}
        lastName={user.last_name}
        handleInputs={handleInputs}
        handleSave={handleSave}
        disableButtons={errorInfo.isError}
      />
      {errorInfo.isError && renderErrorMessage()}
    </>
  );
};

export default withRouter(EditUser);
