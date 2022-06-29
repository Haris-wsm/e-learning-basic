import {
  Autocomplete,
  Button,
  Chip,
  Divider,
  Paper,
  styled,
  TextField,
  Typography
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  createAssignment,
  getAssignmentsBelongToCourse,
  getLessonBelongToCourse
} from '../../../http';
import DateTimePickerCustom from '../../shared/Timepicker/DateTimePickerCustom';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
// library

import taost, { toast } from 'react-hot-toast';
import AssignmentsTable from './AssignmentsTable';

const Input = styled('input')({ display: 'none' });

const initailErrorMessage = { title: '', content: '', ref: '' };

const Assignments = ({ edit }) => {
  const [data, setData] = useState([]);

  // erros message
  const [error, setError] = useState(initailErrorMessage);

  const [date, setDate] = useState('');

  const [files, setFiles] = useState([]);
  const [lesson, setLesson] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Assignment data table state
  const [assignmentData, setAssignmentData] = useState([]);

  const { id } = useParams();

  async function getLessonAutoComplete(courseId) {
    try {
      const res = await getLessonBelongToCourse(courseId);
      setData(res.data.lessons);
    } catch (error) {
      console.log(error);
    }
  }

  function handleSetFile(e) {
    setFiles([...e.target.files]);
    e.target.value = '';
  }

  function handleRemoveFile(index) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit() {
    const formData = new FormData();

    formData.append('ref', lesson);
    formData.append('title', title);
    formData.append('content', content);
    formData.append('date', date);

    if (files)
      for (const file of files) {
        formData.append('file', file);
      }

    requestCreateAssignment(formData);
  }

  async function requestCreateAssignment(data) {
    try {
      await createAssignment(data, id);
      taost.success('Create success!');
      resetOnSubmitSuccess();
      await getAssignments();
    } catch (error) {
      const { validationError } = error.response.data;
      setError((prev) => ({ ...prev, ...validationError }));
      toast.error('Create fails.');
    }
  }

  function resetOnSubmitSuccess() {
    // setLesson('');
    setTitle('');
    setContent('');
    setFiles([]);
  }

  function handeChangeAutoComplete(e, value) {
    setLesson(value._id);
  }

  useEffect(() => {
    getLessonAutoComplete(id);
  }, []);

  useEffect(() => {
    getAssignments();
  }, []);

  const getAssignments = async () => {
    try {
      const res = await getAssignmentsBelongToCourse(id);
      setAssignmentData(res.data.assignments);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <AssignmentsTable
        edit={edit}
        data={assignmentData}
        getAssignments={getAssignments}
      />
      <Box my={4}>
        <Paper sx={{ padding: '16px 24px' }}>
          <Typography variant="h6">Create Assignment</Typography>

          <Box my={3} width="50%" px={2}>
            <TextField
              id="outlined-video-title"
              label="Asignment Name"
              type="text"
              name="title"
              fullWidth
              size="small"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={!!error.title}
              helperText={!!error.title ? error.title : 'Assingment Task Name'}
              onFocus={(e) =>
                setError((prev) => ({ ...prev, [e.target.name]: '' }))
              }
            />
          </Box>
          <Box my={3} width="50%" px={2}>
            <TextField
              id="outlined-multiline-static"
              label="Content"
              multiline
              rows={4}
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              fullWidth
              error={!!error.content}
              helperText={
                !!error.content ? error.content : 'Description for assignment'
              }
              onFocus={(e) =>
                setError((prev) => ({ ...prev, [e.target.name]: '' }))
              }
            />
          </Box>
          <Box my={3} width="50%" px={2}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={data}
              // key={data.name || 'justRandomKey'}
              onChange={handeChangeAutoComplete}
              disableClearable
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Lesson Chapter"
                  helperText="Charpter of lessons for a assignment"
                  name="ref"
                  onFocus={(e) =>
                    setError((prev) => ({ ...prev, [e.target.name]: '' }))
                  }
                  error={!!error.ref}
                  size="small"
                />
              )}
            />
          </Box>
          <Box width="100%" my={3} px={2}>
            <Box my={2}>
              <Divider />
            </Box>
            <Typography my={3} px={2}>
              Date of Sending
            </Typography>

            <Box my={3}>
              <DateTimePickerCustom setDate={setDate} />
            </Box>
          </Box>
          <Box my={3} px={2}>
            {files.length > 0 &&
              files.map((file, i) => (
                <Box my={2} key={i}>
                  <Chip
                    icon={<InsertDriveFileIcon />}
                    label={file.name}
                    onDelete={() => handleRemoveFile(i)}
                  />
                </Box>
              ))}

            <label
              htmlFor="contained-button-file"
              style={{ margin: '16px 0px', padding: 16 }}
            >
              <Input
                // accept="image/*"
                id="contained-button-file"
                multiple
                type="file"
                onChange={handleSetFile}
              />
              <Button
                variant="outlined"
                startIcon={<AddPhotoAlternateIcon />}
                component="span"
              >
                Choose File
              </Button>
            </label>
          </Box>

          <Box my={3} px={2} display="flex" justifyContent="flex-end">
            <Button variant="contained" sizr="large" onClick={handleSubmit}>
              Create Assignment
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default Assignments;
