import React from 'react';
import { useSelector } from 'react-redux';
import TeacherInputGroup from '../../Teacher/InputField/InputField';
import StudentInputGroup from '../../Student/InputField/InputField';

const inputForm = { student: StudentInputGroup, teacher: TeacherInputGroup };

const InputGroupBaseRole = (props) => {
  const { user } = useSelector((state) => state.auth);
  const InputGroup = inputForm[user.role];

  return <InputGroup {...props} />;
};

export default InputGroupBaseRole;
