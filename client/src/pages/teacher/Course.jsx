import { Box, Button, Skeleton, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CardCourse from '../../components/CardCourse/CardCourse';
import Layout from '../../components/layouts/Layout';
import SkeletonCard from '../../components/shared/Skeleton/SkeletonCard';
import { getAllCourse } from '../../http';

const Course = () => {
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCoures = async () => {
      try {
        const res = await getAllCourse();
        setCourses(res.data.courses);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    getCoures();
  }, []);

  return (
    <Layout>
      <Box sx={{ paddingBottom: '24px' }} width="100%">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={3}
        >
          <Typography variant="h4" component="h1">
            My Courses
          </Typography>
          <Box px={2}>
            <Button
              color="primary"
              variant="contained"
              component={Link}
              to="/teacher/course/new"
            >
              Create New Course
            </Button>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
          {loading ? (
            <SkeletonCard total={8} />
          ) : (
            courses.map((course, index) => (
              <CardCourse course={course} key={index} />
            ))
          )}
        </Box>
      </Box>
    </Layout>
  );
};

export default Course;
