import { Box, Divider, IconButton, TextField } from '@mui/material';
import React from 'react';
import ClearIcon from '@mui/icons-material/Clear';

const AdditionInput = ({ handleChange, handleRemove, objectives }) => {
  return (
    <>
      {objectives?.map((objective, index) => (
        <Box key={index}>
          <Box key={objective.id} my={2} display="flex">
            <TextField
              id="outlined-video-title"
              label="Purpose of Lessons"
              type="text"
              name="title"
              fullWidth
              size="small"
              value={objective.objective || ''}
              onChange={(e) => handleChange(objective.id, e.target.value)}
            />

            {objectives.length > 1 && (
              <IconButton
                color="error"
                onClick={() => handleRemove(objective.id)}
              >
                <ClearIcon />
              </IconButton>
            )}
          </Box>
          {index === objectives.length - 1 && <Divider />}
        </Box>
      ))}
    </>
  );
};

export default React.memo(AdditionInput);
