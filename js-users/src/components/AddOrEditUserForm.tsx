import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Button, Input } from '@material-ui/core';

export interface AddOrEditUserCardProps extends RouteComponentProps {
  title: string;
  firstName: string;
  lastName: string;
  handleInputs: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const AddOrEditUserForm: React.FC<AddOrEditUserCardProps> = ({
  title,
  firstName,
  lastName,
  handleInputs,
  handleSave,
  history,
}) => (
  <>
    {title}
    <Input name="firstName" value={firstName} onChange={handleInputs} />
    <Input name="lastName" value={lastName} onChange={handleInputs} />
    <Button
      variant="contained"
      onClick={handleSave}
    >
        SAVE!
    </Button>
    <Button
      variant="contained"
      onClick={() => { history.push('/main'); }}
    >
        Back
    </Button>
  </>
);

export default withRouter(AddOrEditUserForm);
