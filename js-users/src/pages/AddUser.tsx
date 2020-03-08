import React, { useState, ChangeEvent } from 'react';
import {
  Paper, Button, Input,
} from '@material-ui/core';

import { addNewUser } from '../utils/api';
import { ErrorInfo } from '../types/ErrorInfo';
import ErrorMessage from '../components/ErrorMessage';

export interface AddUserProps { }

const AddUser: React.FC<AddUserProps> = (props) => {
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
    console.log('handleSave');
    try {
      await addNewUser(user.first_name, user.last_name);
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

  console.log('adduser state', user);


  return (
    <Paper>
      Add user
      <Input name="firstName" value={user?.first_name} onChange={handleInputs} />
      <Input name="lastName" value={user?.last_name} onChange={handleInputs} />
      <Button
        variant="contained"
        onClick={handleSave}
      >
        SAVE!
      </Button>
      {/* <Button
        variant="contained"
        onClick={backToMainPage}
      >
        Back
      </Button> */}
      {errorInfo.isError && renderErrorMessage()}
    </Paper>
  );
};

export default AddUser;
