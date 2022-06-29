import { Avatar, AvatarGroup, Badge, Chip, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

const LessonHeader = ({ course }) => {
  return (
    <Box sx={{ margin: '32px 0' }}>
      <Typography variant="h5" component="h5" my={3}>
        {course?.name}
      </Typography>
      <Box px={2}>
        <Typography variant="subtitle2" my={1}>
          Professers By
        </Typography>

        <Box display="flex" gap={1} flexWrap="wrap">
          <Chip
            avatar={<Avatar alt="Natacha" src={course?.owner.image} />}
            label={course?.owner.username}
            variant="outlined"
          />
          {course?.professers.map((prof, i) => (
            <Chip
              avatar={<Avatar alt="Natacha" src={prof.image} />}
              label={prof.username}
              variant="outlined"
              key={i}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default LessonHeader;
