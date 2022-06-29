import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography
} from '@mui/material';
import React from 'react';

import { useNavigate } from 'react-router-dom';

const CardTasks = ({ task }) => {
  const navigate = useNavigate();

  const navigateToAssignment = (id) => {
    navigate(`/student/assignments/${id}`);
  };

  return (
    <Card sx={{ minWidth: 220, width: 220 }}>
      <CardMedia
        component="img"
        height="140"
        image="/assets/Course-bg.png"
        alt="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {task.courseRef.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxHeight: 80, overflow: 'hidden' }}
        >
          {task.content}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => navigateToAssignment(task._id)}>
          Do Assignment
        </Button>
      </CardActions>
    </Card>
  );
};

export default CardTasks;
