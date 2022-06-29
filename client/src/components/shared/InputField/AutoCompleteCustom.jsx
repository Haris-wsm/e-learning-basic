import React, { useState } from 'react';
import { Autocomplete, Box, TextField } from '@mui/material';
import { useEffect } from 'react';
import { getUsers } from '../../../http';
import { v4 as uuidV4 } from 'uuid';

const AutoCompleteCustom = (props) => {
  const { label, placeholder, width, my, setData, initail } = props;

  const [options, setOptions] = useState([]);
  const [key, setKey] = useState(uuidV4());
  // const loading = open && options.length === 0;

  useEffect(() => {
    const getUserByRole = async () => {
      try {
        const res = await getUsers({ role: 'teacher' });
        setOptions(res.data.users);
      } catch (error) {
        console.log(error);
      }
    };
    getUserByRole();
  }, []);

  function handleChange(e, value) {
    setData(value.map((t) => t.id));
  }

  useEffect(() => {
    if (initail) {
      setKey(uuidV4());
    }
  }, [initail]);

  return (
    <Box width={width || '100%'} my={my || 2}>
      <Autocomplete
        multiple
        id="tags-standard"
        // value={data}
        key={key}
        options={options}
        defaultValue={initail}
        getOptionLabel={(option) => option.username}
        isOptionEqualToValue={(option, value) =>
          option.username === value.username
        }
        onChange={handleChange}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label={label}
            placeholder={placeholder}
          />
        )}
      />
    </Box>
  );
};

export default AutoCompleteCustom;
