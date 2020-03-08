import React from 'react';
import { Button, Box } from '@material-ui/core';

import { ErrorInfo } from '../types/ErrorInfo';

export interface ErrorMessageProps {
  errorInfo: ErrorInfo;
  onClick: (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ errorInfo, onClick }) => {
  const { message } = errorInfo;


  return (
    <>
      <Box>
        {message}
      </Box>
      <Button
        variant="contained"
        onClick={onClick}
      >
        OK!
      </Button>
    </>
  );
};

export default ErrorMessage;
