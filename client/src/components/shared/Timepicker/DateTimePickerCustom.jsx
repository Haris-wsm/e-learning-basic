import React from 'react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import TimePickerProvider from './TimePickerProvider';
import { TextField } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect } from 'react';

const DateTimePickerCustom = ({ setDate, date }) => {
  const [value, setValue] = React.useState(date ? new Date(date) : new Date());

  const handleChange = (newValue) => {
    const formatedDate = dayjs(newValue).format('MMM D, YYYY h:mm A');
    setDate(formatedDate);
    setValue(newValue);
  };
  useEffect(() => {
    if (date) {
      setDate(dayjs(date).format('MMM D, YYYY h:mm A'));
      setValue(dayjs(date).format('MMM D, YYYY h:mm A'));
    }
  }, [date]);

  useEffect(() => {
    setDate(dayjs(new Date()).format('MMM D, YYYY h:mm A'));
  }, []);

  return (
    <TimePickerProvider>
      <DateTimePicker
        label="Date&Time"
        value={value}
        onChange={handleChange}
        renderInput={(params) => <TextField {...params} />}
      />
    </TimePickerProvider>
  );
};

export default DateTimePickerCustom;
