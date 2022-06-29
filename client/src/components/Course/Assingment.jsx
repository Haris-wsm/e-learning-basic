import React, { useEffect, useState } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import PinDropIcon from '@mui/icons-material/PinDrop';
import { getCourseById } from '../../http';
import { Link, useParams } from 'react-router-dom';

const Assingment = () => {
  const [course, setCourse] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const getCourse = async () => {
      try {
        const res = await getCourseById(id);
        setCourse(res.data.course);
      } catch (error) {
        console.log(error);
      }
    };
    getCourse();
  }, []);
  return (
    <Box
      sx={{
        flex: 2,
        padding: '0 16px',
        display: { xs: 'none', sm: 'none', md: 'none', lg: 'block' }
      }}
    >
      <Box>
        <Box sx={{ marginBottom: '16px' }}>
          <Typography variant="body" component="h4">
            Schedule
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            padding: '12px 0',
            gap: '5px'
          }}
        >
          {course &&
            course.date?.map((date) => (
              <Box key={date._id}>
                <PinDropIcon sx={{ color: '#58595b' }} />
                <Typography variant="p" sx={{ fontSize: '14px' }}>
                  {`${date.day} at ${date.start} to ${date.end}`}
                </Typography>
              </Box>
            ))}
        </Box>
        <Divider />
        <Box>
          <Box sx={{ margin: '16px 0' }}>
            <Typography variant="body" component="h4">
              Upcoming
            </Typography>
          </Box>
          <Box sx={{ marginBottom: '16px' }}>
            {course?.lessons.map((lesson) =>
              lesson?.assignments.map(({ title, date, _id }) => (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginBottom: '16px',
                    gap: '5px',
                    cursor: 'pointer'
                  }}
                  key={_id}
                  component={Link}
                  to={`/student/assignments/${_id}`}
                >
                  <Typography
                    variant="p"
                    sx={{ color: '#4ca0fb', fontWeight: '700' }}
                  >
                    {title}
                  </Typography>
                  <Typography variant="p" sx={{ fontSize: '12px' }}>
                    {date}
                  </Typography>
                </Box>
              ))
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(Assingment);
