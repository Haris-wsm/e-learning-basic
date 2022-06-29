import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { Avatar, IconButton, styled, Tooltip, Typography } from '@mui/material';
import { AutoFixHigh } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';

// Services
import FileUpload from '../../services/FIleUplaod';
import { setRegister } from '../../store/authSlice';
import toast from 'react-hot-toast';

const Input = styled('input')({
  display: 'none'
});

const Profile = () => {
  const [imagePreview, setImagePreview] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  async function handleUpload(e) {
    setImagePreview(e.target.files[0]);

    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    uploadRequest(formData);
  }

  async function uploadRequest(data) {
    try {
      const res = await FileUpload.uploadUserImage(data);
      dispatch(setRegister(res.data.user));
      toast.success('Uplaod image success!!');
    } catch (error) {
      toast.error('Uplaod image fail!!');
      console.log(error);
    }
  }
  return (
    <Box
      sx={{
        flex: 2,
        position: 'relative',
        transition: 'all 1s ease',
        display: { xs: 'none', sm: 'none', md: 'none', lg: 'block' }
      }}
    >
      <Box
        sx={{
          position: 'sticky',
          padding: '10px',
          top: '48px'
        }}
      >
        <Box>
          <Typography variant="h6" component="h6">
            Profile
          </Typography>
        </Box>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            marginTop: '10px'
          }}
        >
          <Tooltip
            title="Upload Image"
            sx={{ position: 'absolute', top: 0, right: '15px' }}
          >
            <Box component="label" htmlFor="icon-button-file">
              <Input
                accept="image/*"
                id="icon-button-file"
                type="file"
                onChange={handleUpload}
              />
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
              >
                <AutoFixHigh />
              </IconButton>
            </Box>
          </Tooltip>

          <Avatar
            src={imagePreview ? URL.createObjectURL(imagePreview) : user.image}
            sx={{ width: '80px', height: '80px' }}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '10px 0'
            }}
          >
            <Typography variant="h6" component="h6">
              {user.username}
            </Typography>
            <Typography variant="caption" component="p">
              {user.subject}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
