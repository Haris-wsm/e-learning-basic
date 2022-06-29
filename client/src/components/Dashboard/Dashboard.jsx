import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import CardTasks from '../CardTasks/CardTasks';
import CourseTable from './CourseTable';
import { useEffect } from 'react';
import { getEnrollCourseAssignments } from '../../http';

const Dashboard = () => {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const getAttachMents = async () => {
      try {
        const res = await getEnrollCourseAssignments();
        setAssignments(res.data.assignment);
      } catch (error) {
        console.log(error);
      }
    };
    getAttachMents();
  }, []);
  return (
    <Box flex="4" sx={{ px: 4, py: 2, width: '100%' }}>
      <Box mb={2}>
        <Typography variant="h4" component="h1" mb={1}>
          Dashboard
        </Typography>
        <Typography variant="h6" component="h6">
          Assigned Tasked
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          p: 1,
          overflowX: 'auto',
          maxWidth: 720,
          mb: 2
        }}
      >
        {assignments?.map((assignment) => (
          <CardTasks key={assignment._id} task={assignment} />
        ))}
      </Box>
      <Box py={2}>
        <Typography mb={2} variant="h6" component="h6">
          My Courses
        </Typography>
        <CourseTable />
      </Box>
    </Box>
  );
};

export default Dashboard;
