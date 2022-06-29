import { Box } from '@mui/system';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React from 'react';

const TimePickerProvider = ({ children }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {React.Children.map(children, (child) => (
        <Box mx={1}>{child}</Box>
      ))}
    </LocalizationProvider>
  );
};

export default TimePickerProvider;
