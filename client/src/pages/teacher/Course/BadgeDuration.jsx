import React from 'react';
import { Chip } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const BadgeDuration = ({ dates }) => {
  return (
    <>
      {dates.map((d, i) => {
        const courseTimeText = `${d.day} ${d.start} to ${d.end}`;
        return (
          <Chip
            label={courseTimeText}
            deleteIcon={<AccessTimeIcon />}
            variant="outlined"
            key={i}
            sx={{ margin: '4px' }}
          />
        );
      })}
    </>
  );
};

export default BadgeDuration;
