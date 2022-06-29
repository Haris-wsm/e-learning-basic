import React, { useState } from 'react';
import Card from '../../../shared/Card/Card';

// input map by role

import StudentInputs from './Role/Student';
import TeacherInputs from './Role/Teacher';
import { useSelector } from 'react-redux';

const mapToRole = { student: StudentInputs, teacher: TeacherInputs };

const UserContact = ({ onBack }) => {
  const { user } = useSelector((state) => state.auth);
  const InputRole = mapToRole[user.role];

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
      <InputRole onBack={onBack} />
    </Card>
  );
};

export default UserContact;
