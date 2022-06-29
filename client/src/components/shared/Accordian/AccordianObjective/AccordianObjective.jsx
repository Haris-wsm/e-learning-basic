import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography
} from '@mui/material';
import React, { useRef, useState } from 'react';
import AccordianList from './AccordianList';

const AccordianObjective = ({ title, panel, purposes }) => {
  const [expanded, setExpanded] = useState(false);
  // const expanded = useRef(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <Box sx={{ margin: '10px 0' }}>
      <Accordion expanded={expanded === panel} onChange={handleChange(panel)}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <AccordianList purposes={purposes} />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

// export default React.memo(AccordianObjective);
export default AccordianObjective;
