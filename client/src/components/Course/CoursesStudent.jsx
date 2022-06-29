import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { enrollCourse, getCourseByFilter } from '../../http';
import CardCourse from '../CardCourse/CardCourse';
import taost from 'react-hot-toast';
import SkeletonCard from '../shared/Skeleton/SkeletonCard';

const CourseStudent = () => {
  const [filter, setFilter] = useState('me');
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  function handleChange(e) {
    setFilter(e.target.value);
  }

  useEffect(() => {
    let active = true;
    const getCourse = async () => {
      try {
        setIsLoading(true);
        const res = await getCourseByFilter(filter);

        if (active) {
          setCourses(res.data.courses);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getCourse();

    return () => {
      active = false;
    };
  }, [filter]);

  async function handleEnroll(id) {
    try {
      await enrollCourse({ courseRef: [id] });
      setFilter('me');
      taost.success('Enroll Successful!');
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Box sx={{ paddingBottom: '24px' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          marginBottom: '16px'
        }}
      >
        <Typography variant="h4" component="h1" mb={3}>
          Courses
        </Typography>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="demo-simple-select-helper-label">Filter</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={filter}
            label="Filter"
            onChange={handleChange}
          >
            <MenuItem value="me">My Courses</MenuItem>
            <MenuItem value="all">All</MenuItem>
          </Select>
          <FormHelperText>Filter courses</FormHelperText>
        </FormControl>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
          <SkeletonCard />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
          {courses?.map((course) => (
            <CardCourse
              course={course}
              key={course._id}
              enroll={filter === 'all'}
              handleEnroll={handleEnroll}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CourseStudent;
