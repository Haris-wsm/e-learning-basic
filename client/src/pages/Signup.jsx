import React, { useState } from 'react';
import UserContact from '../components/Step/Register/UserContact/UserContact';
import UserForm from '../components/Step/Register/UserForm/UserForm';

const Steps = { 1: UserForm, 2: UserContact };

const Signup = () => {
  const [step, setStep] = useState(1);
  const Step = Steps[step];

  // Reset all fields on unmounth

  function next() {
    setStep(step + 1);
  }

  function back() {
    if (step > 1) setStep(step - 1);
  }

  return <Step onNext={next} onBack={back} step={step} />;
};

export default Signup;
