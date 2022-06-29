import {
  Box,
  FormControlLabel,
  FormGroup,
  Switch,
  Typography
} from '@mui/material';
import React from 'react';

const ProfileHeader = ({ edit, setEdit }) => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="h6">Profile</Typography>
      <FormGroup>
        <FormControlLabel
          control={<Switch checked={edit} onChange={setEdit} />}
          label="Edit Profile"
        />
      </FormGroup>
    </Box>
  );
};

export default ProfileHeader;
