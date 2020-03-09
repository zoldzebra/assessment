import React from 'react';
import { Button, Box, Grid, makeStyles } from '@material-ui/core';

import { ErrorInfo } from '../types/ErrorInfo';

const useStyles = makeStyles({
  errorContainer: {
    padding: '16px',
  },
  message: {
    padding: '16px',
  },

});

export interface ErrorMessageProps {
  errorInfo: ErrorInfo;
  onClick: (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ errorInfo, onClick }) => {
  const classes = useStyles();
  const { message } = errorInfo;

  return (
    <Grid container direction="column" alignItems="center" justify="center" className={classes.errorContainer}>
      <Box className={classes.message}>
        {message}
      </Box>
      <Button
        variant="contained"
        color="secondary"
        onClick={onClick}
      >
        I am sad.
      </Button>
    </Grid>
  );
};

export default ErrorMessage;
