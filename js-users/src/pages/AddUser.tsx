/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, ChangeEvent } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { addNewUser } from '../utils/api';
import { ErrorInfo } from '../types/ErrorInfo';
import ErrorMessage from '../components/ErrorMessage';
import AddOrEditUserForm from '../components/AddOrEditUserForm';

export type AddUserProps = RouteComponentProps

const AddUser: React.FC<AddUserProps> = ({ history }) => {
  const emptyState = {
    first_name: '',
    last_name: '',
  };
  const [user, setUser] = useState(emptyState);
  const [errorInfo, setErrorInfo] = useState<ErrorInfo>({
    isError: false,
    message: '',
  });

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
    try {
      await addNewUser(user.first_name, user.last_name);
      history.push('/main');
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
        title="Add user"
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

export default withRouter(AddUser);
