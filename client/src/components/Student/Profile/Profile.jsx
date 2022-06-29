import { Box, Button, Divider, Paper, styled, Typography } from '@mui/material';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InputGroupBaseRole from '../../shared/Profile/InputGroupBaseRole';
import InputFields from '../InputField/InputField';
import ProfileHeader from './ProfileHeader';
import UserImage from './UserImage';

const ProfileItem = styled(Box)(({ theme }) => ({
  padding: '16px',
  [theme.breakpoints.down('md')]: {
    width: '100%'
  },
  [theme.breakpoints.up('md')]: {
    width: '50%'
  }
}));

const ProfileWrapper = styled(Box)(({ theme }) => ({
  flexWrap: 'wrap',
  margin: '16px 0',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column-reverse'
  }
}));

const ButtonWrapper = styled(Box)(({ theme }) => ({
  padding: '16px',
  justifyContent: 'flex-end',
  width: '100%'
}));

const DividerLine = styled(Divider)(({ theme }) => ({
  margin: '16px 0',
  [theme.breakpoints.down('md')]: {
    width: '100%'
  },
  [theme.breakpoints.up('md')]: {
    width: '75%'
  }
}));

const Container = styled(Paper)(({ theme }) => ({
  width: '100%',
  margin: '24px 0',
  padding: '16px'
}));

const Profile = () => {
  const [IsEdit, setIsEdit] = useState(false);
  const inputFieldsRef = useRef();

  function handleEdit(e) {
    setIsEdit(e.target.checked);
  }

  return (
    <Box sx={{ flex: 6 }} px={2} py={2}>
      <Box width="100%">
        <Typography variant="h4">Profile</Typography>
        <DividerLine />
        <Container>
          <ProfileHeader edit={IsEdit} setEdit={handleEdit} />
          <ProfileWrapper display="flex">
            <ProfileItem>
              <InputGroupBaseRole
                readOnly={IsEdit}
                ref={inputFieldsRef}
                setEdit={setIsEdit}
              />

              {/* <InputFields
                readOnly={IsEdit}
                ref={inputFieldsRef}
                setEdit={setIsEdit}
              /> */}
            </ProfileItem>
            <ProfileItem>
              <UserImage edit={IsEdit} />
            </ProfileItem>
          </ProfileWrapper>

          {IsEdit && (
            <ButtonWrapper>
              <Button
                variant="contained"
                onClick={() => inputFieldsRef.current.handleSubmit()}
              >
                Save Change
              </Button>
            </ButtonWrapper>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default Profile;
