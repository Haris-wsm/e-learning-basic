import { Box, styled, TextField, Typography } from '@mui/material';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../../http';
import { setRegister } from '../../../store/authSlice';

// Toast

import toast from 'react-hot-toast';

const InputWrapper = styled(Box)(({ theme }) => ({
  marginBottom: '20px'
}));

const initailValue = {
  username: '',
  subject: '',
  password: '',
  newpassword: '',
  consfirmPassword: ''
};

const InputFields = forwardRef(({ readOnly, setEdit }, ref) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [username, setUsername] = useState(user.username || '');
  const [subject, setSubject] = useState(user.subject || '');
  const [password, setPassword] = useState('');
  const [newpassword, setNewpassword] = useState('');
  const [consfirmPassword, setConsfirmPassword] = useState('');

  const [errors, setErros] = useState(initailValue);

  useImperativeHandle(ref, () => ({
    async handleSubmit() {
      let data = {
        username,
        subject
      };

      if (password) {
        data = { ...data, password, newpassword, consfirmPassword };
      }

      try {
        const res = await updateUser(data, user.id);

        // Update redux state
        dispatch(setRegister(res.data.user));

        // set toastify success
        toast.success('Update Success!!');

        // Reset errors to be empty
        setErros(initailValue);

        // close Edit Stae
        setEdit(false);
      } catch (error) {
        const { validationError } = error.response.data;
        setErros((prev) => ({ ...prev, ...validationError }));
        toast.error('Update Fail!!');
        console.log(error.response.data);
      }
    }
  }));

  return (
    <>
      <InputWrapper>
        <TextField
          fullWidth
          label="Username"
          name="username"
          id="user-username"
          helperText={
            errors.username ? errors.username : 'Username in this application'
          }
          InputProps={{
            readOnly: !readOnly
          }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={!!errors.username}
          onFocus={(e) =>
            setErros((prev) => ({ ...prev, [e.target.name]: '' }))
          }
        />
      </InputWrapper>

      <InputWrapper>
        <TextField
          fullWidth
          label="Teacher Subject"
          id="user-subject"
          name="subject"
          helperText="Teacher subject"
          InputProps={{
            readOnly: !readOnly
          }}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          onFocus={(e) =>
            setErros((prev) => ({ ...prev, [e.target.name]: '' }))
          }
          error={!!errors.subject}
        />
      </InputWrapper>

      {readOnly && (
        <>
          <Box my={2}>
            <Typography>Reset Password</Typography>
          </Box>
          <InputWrapper>
            <TextField
              fullWidth
              label="Password"
              id="user-password"
              type="password"
              name="password"
              helperText={
                errors.password ? errors.password : 'Your current password'
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={(e) =>
                setErros((prev) => ({ ...prev, [e.target.name]: '' }))
              }
              error={!!errors.password}
            />
          </InputWrapper>
          <InputWrapper>
            <TextField
              fullWidth
              label="New Password"
              id="user-newpassword"
              type="password"
              name="newpassword"
              helperText={
                errors.newpassword ? errors.newpassword : 'New password'
              }
              value={newpassword}
              onChange={(e) => setNewpassword(e.target.value)}
              onFocus={(e) =>
                setErros((prev) => ({ ...prev, [e.target.name]: '' }))
              }
              error={!!errors.newpassword}
            />
          </InputWrapper>
          <InputWrapper>
            <TextField
              fullWidth
              label="Confirm Password"
              id="user-confirm"
              type="password"
              name="consfirmPassword"
              helperText={
                errors.consfirmPassword
                  ? errors.consfirmPassword
                  : 'To confirm new password'
              }
              value={consfirmPassword}
              onChange={(e) => setConsfirmPassword(e.target.value)}
              onFocus={(e) =>
                setErros((prev) => ({ ...prev, [e.target.name]: '' }))
              }
              error={!!errors.consfirmPassword}
            />
          </InputWrapper>
        </>
      )}
    </>
  );
});

export default InputFields;
