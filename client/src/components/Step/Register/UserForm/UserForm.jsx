import { Box, Button } from '@mui/material';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { findUser } from '../../../../http';
import { setRegister } from '../../../../store/authSlice';

import Card from '../../../shared/Card/Card';
// import Input from '../../../shared/InputFIeld/Input';
import Input from '../../../shared/InputField/Input';
import style from './UserForm.module.css';

const UserForm = ({ onNext, step }) => {
  // state from redux
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [role, setRole] = useState(user?.role || 'student');
  const [username, setUsername] = useState(user?.username || '');
  const [password, setPassword] = useState(user?.password || '');
  const [confirmPass, setConfirmPass] = useState(user?.confirmPass || '');

  async function handleOnNext() {
    if (!role || !username || !password || !confirmPass) {
      toast.error('All fields required!');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be greater than 6');
      return;
    }

    if (password !== confirmPass) {
      toast.error('Password not match!');
      return;
    }

    try {
      await findUser({ username: username });
      dispatch(setRegister({ role, username, password, confirmPass }));
      onNext();
    } catch (error) {
      const { message } = error.response.data;
      toast.error(message);
    }
  }

  return (
    <Card
      header="Register"
      subHeading="Become new classmate with us!"
      footer={{
        footerText: 'Alreardy have account? ',
        linkText: 'Sign in',
        path: '/'
      }}
    >
      <div className={style.button_wrapper}>
        <button
          className={`${style.tabs} ${role === 'student' && style.active}`}
          onClick={() => setRole('student')}
        >
          Student
        </button>
        <button
          className={`${style.tabs} ${role === 'teacher' && style.active}`}
          onClick={() => setRole('teacher')}
        >
          Teacher
        </button>
      </div>

      <div className={style.form_inputs}>
        {/* {step} */}
        <Input
          label="Username"
          value={username}
          setValue={setUsername}
          type="text"
          placeholder="Enter your username"
        />
        <Input
          label="Password"
          value={password}
          setValue={setPassword}
          type="password"
          placeholder="Enter your password"
        />
        <Input
          label="Confirm Password"
          value={confirmPass}
          setValue={setConfirmPass}
          type="password"
          placeholder="Confirm your password"
        />
      </div>
      <Box my={3}>
        <Button variant="contained" onClick={() => handleOnNext()} fullWidth>
          Next
        </Button>
      </Box>
    </Card>
  );
};

export default UserForm;
