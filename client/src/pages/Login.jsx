import React, { useState } from 'react';
import toast from 'react-hot-toast';

import Card from '../components/shared/Card/Card';
// import Input from '../components/shared/InputFIeld/Input';
import style from './Login.module.css';

// http

import { login } from '../http';
import { setAuth } from '../store/authSlice';
import { useDispatch } from 'react-redux';
import Input from '../components/shared/InputField/Input';
import { Box, Button } from '@mui/material';

const Login = () => {
  const [role, setRole] = useState('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  async function handleLogin() {
    try {
      const res = await login({ username, password, role });
      dispatch(setAuth(res.data));
    } catch (error) {
      const { message } = error.response.data;
      toast.error(message);
    }
  }

  return (
    <Card
      header="LOGIN"
      subHeading="Please Choose your Role"
      footer={{
        footerText: 'New classmate? ',
        linkText: 'Sign up',
        path: '/signup'
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
        <Input
          label="Username"
          type="text"
          placeholder="Enter your username"
          value={username}
          setValue={setUsername}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          setValue={setPassword}
        />
      </div>
      <Box my={3}>
        <Button onClick={handleLogin} variant="contained" fullWidth my={2}>
          Sign in
        </Button>
      </Box>
    </Card>
  );
};

export default Login;
