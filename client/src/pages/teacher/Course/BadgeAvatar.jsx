import { Avatar, Chip } from '@mui/material';
import React from 'react';

const BadgeAvatar = ({ course }) => {
  return (
    <>
      <Chip
        avatar={
          <Avatar alt={course?.owner.username} src={course?.owner.image} />
        }
        label={course?.owner.username}
        variant="outlined"
      />
      {course?.professers.map((professer, i) => (
        <Chip
          avatar={<Avatar alt={professer.username} src={professer.image} />}
          label={professer.username}
          variant="outlined"
          key={i}
        />
      ))}
    </>
  );
};

export default BadgeAvatar;
