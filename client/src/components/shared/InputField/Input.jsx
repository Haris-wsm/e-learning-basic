import { Box, TextField } from '@mui/material';
import React from 'react';

const Input = (props) => {
  const { label, value, setValue, type, placeholder, multiline, width } = props;

  return (
    <Box my={props.my || 1} width={width || '100%'}>
      <TextField
        {...props}
        id="outlined-basic"
        label={label}
        value={value}
        type={type}
        placeholder={placeholder || ''}
        onChange={(e) => setValue(e.target.value)}
        variant="outlined"
        size="small"
        multiline={multiline}
        fullWidth
        // inputProps={{
        //   style: {
        //     fontSize: 14,
        //     backgroundColor: '#e6eef5',
        //     '&::placeholder': {
        //       fontSize: 10
        //     }
        //   }
        // }}
        // InputLabelProps={{
        //   style: {
        //     fontSize: 14,
        //     backgroundColor: 'none'
        //   }
        // }}
      />
    </Box>
  );
};

export default Input;
