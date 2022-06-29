import {
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import React, { useEffect, useState } from 'react';
import TimePickerProvider from './TimePickerProvider';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import dayjs from 'dayjs';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const TimePickerForm = (props) => {
  const { remove, unique, setPicker, isMultiple, initailDate } = props;

  const [days, setDays] = useState(initailDate?.day || DAYS[0]);
  const [staredTime, setStartedTime] = useState(
    initailDate?.start ? covertTimeToDate(initailDate?.start) : new Date()
  );
  const [endedTime, setEndedTime] = useState(
    initailDate?.end ? covertTimeToDate(initailDate?.end) : new Date()
  );

  function covertTimeToDate(time) {
    const [hour, min] = time.split(' ')[0].split(':');

    // covertion time in format of HH:MM to Date format
    return new Date(null, null, null, hour, min);
  }

  function handleChangeDate(e) {
    setPicker(unique, { day: e.target.value });
    setDays(e.target.value);
  }

  function handleChangeTimeStart(time) {
    setStartedTime(time);
    setPicker(unique, { start: dayjs(time).format('HH:mm A') });
  }
  function handleChangeTimeEnd(time) {
    setEndedTime(time);
    setPicker(unique, { end: dayjs(time).format('HH:mm A') });
  }

  useEffect(() => {
    if (!initailDate) {
      setPicker(unique, {
        start: dayjs(staredTime).format('HH:mm A'),
        end: dayjs(endedTime).format('HH:mm A'),
        day: days
      });
    }
  }, []);

  return (
    <>
      <Box display="flex" my={3} alignItems="center">
        <Box width="20%" mx={2}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Day</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={days}
              label="day"
              name="day"
              onChange={handleChangeDate}
            >
              {DAYS.map((day) => (
                <MenuItem value={day} key={day}>
                  {day}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <TimePickerProvider>
          <TimePicker
            value={staredTime}
            onChange={handleChangeTimeStart}
            renderInput={(params) => (
              <TextField {...params} label="Started At" />
            )}
          />
          <TimePicker
            value={endedTime}
            onChange={handleChangeTimeEnd}
            renderInput={(params) => <TextField {...params} label="Ended At" />}
          />
        </TimePickerProvider>
        {isMultiple && (
          <IconButton
            aria-label="upload picker"
            color="error"
            component={Button}
            onClick={() => remove(unique)}
          >
            <HighlightOffIcon />
          </IconButton>
        )}
      </Box>
      <Box my={1}>
        <Divider />
      </Box>
    </>
  );
};

export default React.memo(TimePickerForm);
