import React from 'react';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GolfCourseIcon from '@mui/icons-material/GolfCourse';

import { Box, Typography } from '@mui/material';

const AccordianLessonDetails = () => {
  return (
    <Box sx={{ display: 'flex', gap: '10px', padding: '0 5px' }}>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <OndemandVideoIcon />
        <Typography variant="caption" component="span">
          50 min of videos left
        </Typography>
      </Box>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <MenuBookIcon />
        <Typography variant="caption" component="span">
          2h 40m of readings left
        </Typography>
      </Box>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <GolfCourseIcon />
        <Typography variant="caption" component="span">
          1 graded assignment left
        </Typography>
      </Box>
    </Box>
  );
};

export default React.memo(AccordianLessonDetails);
// export default AccordianLessonDetails;
