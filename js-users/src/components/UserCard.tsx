import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import {
  Paper,
  Box,
  makeStyles,
  FormControlLabel,
  Switch,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Grid,
} from '@material-ui/core';

import { User } from '../types/User';
import { ErrorInfo } from '../types/ErrorInfo';
import { updateUser } from '../utils/api';
import ErrorMessage from './ErrorMessage';

const useStyles = makeStyles({
  card: {
    padding: '16px',
  },
  strikethrough: {
    textDecoration: 'line-through',
  },
  tableCell: {
    padding: 0,
  },
  actionArea: {
    marginTop: '16px',
  },
});

export interface UserCardProps extends RouteComponentProps {
  user: User;
  onStatusUpdate: (id: number) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onStatusUpdate, history }) => {
  const classes = useStyles();
  const [isLocked, setIsLocked] = useState(user.status === 'locked');
  const [errorInfo, setErrorInfo] = useState<ErrorInfo>({
    isError: false,
    message: '',
  });

  const handleStatusChange = async () => {
    try {
      const newUser = { ...user };
      newUser.status = isLocked ? 'active' : 'locked';
      const update = await updateUser(newUser);
      if (update) {
        setIsLocked(!isLocked);
        onStatusUpdate(user.id);
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

  const getReadableDate = (dateString: string) => {
    const fullDate = new Date(dateString);
    const date = fullDate.toDateString();
    const hours = fullDate.getHours();
    const minutes = fullDate.getMinutes();
    const seconds = fullDate.getSeconds();
    return `${date} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <Paper className={classes.card} elevation={3}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className={classes.tableCell}>
              User:
            </TableCell>
            <TableCell>
              <Box className={`${isLocked && classes.strikethrough} `}>{`${user.first_name} ${user.last_name} `} </Box>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              Created at:
            </TableCell>
            <TableCell>
              <Box className={`${isLocked && classes.strikethrough} `}>{`${getReadableDate(user.created_at)} `}</Box>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              Status:
            </TableCell>
            <TableCell>
              <FormControlLabel
                control={
                  (
                    <Switch
                      checked={!isLocked}
                      onChange={handleStatusChange}
                      color="primary"
                      size="small"
                    />
                  )
                }
                label={user.status}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Grid container justify="center" className={classes.actionArea}>
        <Grid item>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => history.push(`/main/edit/${user.id}`)}
          >
            Edit user
          </Button>
        </Grid>
      </Grid>
      <Grid item>
        {errorInfo.isError && renderErrorMessage()}
      </Grid>
    </Paper>
  );
};

export default withRouter(UserCard);
