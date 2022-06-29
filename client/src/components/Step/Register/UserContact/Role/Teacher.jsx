import { Button } from '@mui/material';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../../../../../http';

import { setAuth, setRegister } from '../../../../../store/authSlice';
import Input from '../../../../shared/InputField/Input';
import style from '../UserContact.module.css';

const Teacher = ({ onBack }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [subject, setSubject] = useState(user?.subject || '');
  const [email, setEmail] = useState(user?.email || '');

  async function submitForm() {
    if (!subject || !email) {
      toast.error('All fields required!');
      return;
    }

    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!mailformat.test(email)) {
      toast.error('Email not valid!');
      return;
    }

    try {
      const res = await signup({ ...user, email, subject });
      dispatch(setRegister({ email, subject }));
      dispatch(setAuth(res.data));
    } catch (error) {
      const { message } = error.response.data;
      toast.error(message);
    }
  }

  return (
    <>
      <div className={style.form_inputs}>
        <Input
          label="Teaching of"
          value={subject}
          setValue={setSubject}
          type="text"
          placeholder="Enter your Teaching subject"
        />

        <Input
          label="Email"
          value={email}
          setValue={setEmail}
          type="text"
          placeholder="Enter your Email"
        />
      </div>

      <Button
        variant="outlined"
        fullWidth
        onClick={() => {
          onBack();
        }}
      >
        Back
      </Button>

      <Button variant="contained" onClick={submitForm} fullWidth>
        Create Account
      </Button>
    </>
  );
};

export default Teacher;
