import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Accordian from '../shared/Accordian/Accordian';
import LessonHeader from './LessonHeader';
import { getCourseById } from '../../http';
import { useParams } from 'react-router-dom';
import SkeletonList from '../shared/Skeleton/SkeletonList';

const Lessons = () => {
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const getCourse = async () => {
      try {
        setIsLoading(true);
        const res = await getCourseById(id);
        setCourse(res.data.course);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getCourse();
  }, []);

  return (
    <Box sx={{ padding: '16px' }}>
      {isLoading ? (
        <SkeletonList />
      ) : (
        <>
          <LessonHeader course={course} />
          {course?.lessons.map((lesson) => (
            <Accordian title={lesson?.name} lesson={lesson} key={lesson._id} />
          ))}
        </>
      )}
    </Box>
  );
};

export default Lessons;
