import React from 'react';
import { Button, Box } from '@material-ui/core';

import { Error } from '../types/Error';

export interface ErrorMessageProps {
  errorInfo: Error;
  onClick: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ errorInfo, onCLick }) => {
  const { message } = errorInfo;


  return (
    <>
      <Box>
        {message}
      </Box>
      <Button
        variant="contained"
        onClick={onCLick()}
      >
        OK :(
      </Button>
    </>
  );
};

export default ErrorMessage;
