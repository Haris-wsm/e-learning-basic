import { AutoFixHigh } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  IconButton,
  styled,
  Tooltip
} from '@mui/material';
import React, { useState } from 'react';
import { uploadImage } from '../../../http';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setRegister } from '../../../store/authSlice';

// Services
import FileUpload from '../../../services/FIleUplaod';

const Image = styled(Avatar)(({ theme }) => ({
  width: '100px',
  height: '100px',
  [theme.breakpoints.up('md')]: {
    width: '160px',
    height: '160px'
  }
}));

const Input = styled('input')({
  display: 'none'
});

const UserImage = ({ edit }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  function handleChange(e) {
    setImagePreview(e.target.files[0]);
  }

  async function handleUpload() {
    if (imagePreview) {
      const formData = new FormData();
      formData.append('image', imagePreview);
      uploadRequest(formData);
    }
  }

  async function uploadRequest(data) {
    try {
      const res = await FileUpload.uploadUserImage(data);
      dispatch(setRegister(res.data.user));
      toast.success('Uplaod image success!!');
    } catch (error) {
      toast.success('Uplaod image fail!!');

      console.log(error);
    }
  }

  return (
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
      {edit && (
        <Tooltip
          title="Upload Image"
          sx={{ position: 'absolute', bottom: 0, right: '15px' }}
        >
          <Box component="label" htmlFor="icon-button-file">
            <Input
              accept="image/*"
              id="icon-button-file"
              type="file"
              onChange={handleChange}
            />
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
              sx={{ position: 'absolute', bottom: '15px', right: '15px' }}
            >
              <AutoFixHigh />
            </IconButton>
          </Box>
        </Tooltip>
      )}

      {edit ? (
        <>
          <Image
            src={imagePreview ? URL.createObjectURL(imagePreview) : user.image}
          />
          <Box mt={3}>
            <Button variant="contained" onClick={handleUpload}>
              Save Change
            </Button>
          </Box>
        </>
      ) : (
        <Image src={user.image} />
      )}
    </Box>
  );
};

export default UserImage;
