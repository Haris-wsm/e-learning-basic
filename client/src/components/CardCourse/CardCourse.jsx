import React from 'react';
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography
} from '@mui/material';

import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CardCourse = ({ course, enroll, handleEnroll }) => {
  const { user } = useSelector((state) => state.auth);

  const isStudent = user.role === 'student';

  return (
    <Card sx={{ minWidth: 280, width: 250, padding: '10px' }}>
      <CardMedia
        component="img"
        height="180"
        image={course.image}
        alt="green iguana"
        sx={{ borderRadius: 'inherit' }}
        loading="lazy"
      />
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{ maxHeight: '96px', overflow: 'hidden', fontSize: '20px' }}
        >
          {course?.name}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {course.professers.map((professer) => professer.username).join(', ')}
        </Typography>
        <Box sx={{ display: 'flex', padding: '10px 0' }}>
          <AvatarGroup max={4}>
            <Avatar
              key={course._id}
              alt={course.owner.username}
              src={course.owner.image}
            />
            {course.professers.map((professer, index) => (
              <Avatar
                key={index}
                alt={professer.username}
                src={professer.image}
              />
            ))}
          </AvatarGroup>
        </Box>
      </CardContent>
      <CardActions sx={{ float: 'right' }}>
        {isStudent ? (
          enroll ? (
            <Button size="small" onClick={() => handleEnroll(course._id)}>
              Enroll
            </Button>
          ) : (
            <Button
              size="small"
              component={Link}
              to={`/${user?.role}/course/${course._id}`}
            >
              Learn
            </Button>
          )
        ) : (
          <Button
            size="small"
            component={Link}
            to={`/${user?.role}/course/${course._id}`}
          >
            Visit Dashboard
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default CardCourse;
