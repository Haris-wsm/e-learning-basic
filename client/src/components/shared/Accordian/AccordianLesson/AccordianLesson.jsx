import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import AccordianList from './AccordianList';

const AccordianLesson = ({ lessonName, lesson }) => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (lessonName) => (event, isExpanded) => {
    setExpanded(isExpanded ? lessonName : false);
  };
  return (
    <Box sx={{ margin: '20px 0' }}>
      <Accordion
        expanded={expanded === lessonName}
        onChange={handleChange(lessonName)}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1bh-content"
          id="lesson-1-header"
        >
          <Typography
            component="content"
            // variant="content"
            sx={{ width: '33%', flexShrink: 0 }}
          >
            {lessonName}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <AccordianList lesson={lesson} />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default React.memo(AccordianLesson);
// export default AccordianLesson;
