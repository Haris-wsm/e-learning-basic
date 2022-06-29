import React, { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Typography
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import AccordianLessonDetails from './AccordianLessonDetails';
import AccordianObjective from './AccordianObjective/AccordianObjective';
import AccordianLesson from './AccordianLesson/AccordianLesson';

const Accordian = ({ title, lesson }) => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <Accordion
      expanded={expanded === 'panel1'}
      onChange={handleChange('panel1')}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
      >
        <Typography sx={{ width: '33%', flexShrink: 0 }}>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <AccordianLessonDetails />
        <Divider sx={{ margin: '5px 0' }} />
        <AccordianObjective
          title="Learning Objectives"
          panel="panel2"
          purposes={lesson?.purposes}
        />
        <AccordianLesson lessonName={lesson?.name} lesson={lesson} />
      </AccordionDetails>
    </Accordion>
  );
};

export default React.memo(Accordian);
// export default Accordian;
