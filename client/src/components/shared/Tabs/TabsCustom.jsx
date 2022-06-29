import {
  Box,
  FormControlLabel,
  FormGroup,
  Switch,
  Tab,
  Tabs
} from '@mui/material';
import React, { useState } from 'react';
import Assignments from '../../Teacher/Course/Assignments';
import TabPanel from './TabPanel';

import VideoUploader from '../../Teacher/VideoUploader/VideoUploader';
import Lessons from '../../Teacher/Course/Lessons';

const TabsCustom = () => {
  const [value, setValue] = useState(0);
  const [isEdit, setIsEdit] = useState(false);

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Box display="flex" justifyContent="flex-end">
        <FormGroup>
          <FormControlLabel
            control={
              <Switch value={isEdit} onChange={() => setIsEdit(!isEdit)} />
            }
            label="Edit"
          />
        </FormGroup>
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Vidoes" />
          <Tab label="Assignments" />
          <Tab label="Lessons" />
        </Tabs>

        <TabPanel value={value} index={0}>
          <VideoUploader edit={isEdit} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Assignments edit={isEdit} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Lessons edit={isEdit} />
        </TabPanel>
      </Box>
    </>
  );
};

export default TabsCustom;
