import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Grid, Button, Input, makeStyles, Box } from '@material-ui/core';

const useStyles = makeStyles({
  title: {
    padding: '16px',
  },
  label: {
    fontSize: '14px',
  },
  inputs: {
    marginBottom: '16px',
  },
  actionArea: {
    marginTop: '16px',
  },
});

export interface AddOrEditUserCardProps extends RouteComponentProps {
  title: string;
  firstName: string;
  lastName: string;
  handleInputs: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disableButtons: boolean;
}

const AddOrEditUserForm: React.FC<AddOrEditUserCardProps> = ({
  title,
  firstName,
  lastName,
  handleInputs,
  handleSave,
  disableButtons,
  history,
}) => {
  const classes = useStyles();

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <Grid item className={classes.title}>
        {title}
      </Grid>
      <Grid item>
        <Grid container direction="column">
          <Grid item className={classes.inputs}>
            <Grid container direction="row" alignItems="center" justify="space-between" spacing={2}>
              <Grid item>
                <Box className={classes.label}>
                  First name:
                </Box>
              </Grid>
              <Grid item>
                <Input name="firstName" value={firstName} onChange={handleInputs} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="row" alignItems="center" justify="space-between" spacing={2}>
              <Grid item>
                <Box className={classes.label}>
                  Last name:
                </Box>
              </Grid>
              <Grid item>
                <Input name="lastName" value={lastName} onChange={handleInputs} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item className={classes.actionArea}>
        <Grid container direction="row" alignItems="center" justify="space-between" spacing={4}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              disabled={disableButtons}
              onClick={() => { history.push('/main'); }}
            >
              Back
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              disabled={disableButtons}
              onClick={handleSave}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withRouter(AddOrEditUserForm);
