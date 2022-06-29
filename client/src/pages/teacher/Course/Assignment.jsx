import {
  Box,
  Paper,
  TextField,
  Typography,
  styled,
  Chip,
  Divider,
  Button
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import Layout from '../../../components/layouts/Layout';
import DateTimePickerCustom from '../../../components/shared/Timepicker/DateTimePickerCustom';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import {
  deleteAssignment,
  getAssignment,
  updateAssignment
} from '../../../http';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const Wrapper = styled(Box)(({ theme }) => ({
  width: '50%',
  margin: '24px',
  padding: '0px 16px',

  [theme.breakpoints.down('md')]: {
    width: '100%'
  }
}));

const Input = styled('input')({ display: 'none' });

const Assignment = () => {
  const [date, setDate] = useState('');
  const [assignment, setAssignment] = useState(null);

  const [files, setFiles] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    requestGetAssignment();
  }, []);

  const requestGetAssignment = async () => {
    try {
      const res = await getAssignment(id);
      setAssignment(res.data.assignment);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteFile = async (filename) => {
    try {
      await deleteAssignment({ file: filename }, id);
      toast.success('Delete file success!');
      deleteFile(filename);
    } catch (error) {
      toast.error('Delete file fail!');
      console.log(error);
    }
  };

  const deleteFile = (filename) => {
    setAssignment((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((f) => f !== filename)
    }));
  };
  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetFile = (e) => {
    setFiles([...e.target.files]);
    e.target.value = '';
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('title', assignment.title);
    formData.append('content', assignment.content);
    formData.append('date', date);

    if (files) {
      for (const file of files) {
        formData.append('file', file);
      }
    }
    requestUpdateAssignment(formData);
  };

  const requestUpdateAssignment = async (assignment) => {
    try {
      await updateAssignment(assignment, id);
      toast.success('Assignment successfully updated!');
      await requestGetAssignment();
      setFiles(null);
    } catch (error) {
      toast.success('Assignment failed to updated!');

      console.log(error);
    }
  };

  const handleChange = (e) => {
    setAssignment((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Layout>
      <Box p={2} width="100%">
        <Paper sx={{ padding: '16px' }}>
          <Wrapper my={3}>
            <Typography>Change Assignment Info</Typography>
          </Wrapper>
          <Wrapper my={3}>
            <TextField
              label="title"
              helperText="Assignment Task name"
              fullWidth
              size="small"
              name="title"
              value={assignment?.title || ''}
              onChange={handleChange}
            />
          </Wrapper>
          <Wrapper>
            <TextField
              label="Description"
              helperText="Info of assigment task"
              fullWidth
              size="small"
              name="content"
              onChange={handleChange}
              multiline
              row={4}
              value={assignment?.content || ''}
            />
          </Wrapper>

          <Wrapper>
            <DateTimePickerCustom setDate={setDate} date={assignment?.date} />
          </Wrapper>

          <Wrapper>
            {assignment?.attachments.map((file, i) => {
              let [_, ...filename] = file.split('-');
              filename = filename.join('-');

              return (
                <Box
                  my={2}
                  key={i}
                  sx={{ maxWidth: '500px', flexWrap: 'wrap' }}
                >
                  <Chip
                    icon={<InsertDriveFileIcon />}
                    label={filename}
                    onDelete={() => handleDeleteFile(file)}
                  />
                </Box>
              );
            })}
          </Wrapper>
          <Wrapper>
            <Divider />
          </Wrapper>
          <Wrapper>
            <Box my={3}>
              <Typography variant="subtitle2" component="span">
                Upload files
              </Typography>
              {files &&
                files.map((file, i) => (
                  <Box
                    my={2}
                    key={i}
                    sx={{ maxWidth: '500px', flexWrap: 'wrap' }}
                  >
                    <Chip
                      icon={<InsertDriveFileIcon />}
                      label={file.name}
                      onDelete={() => handleRemoveFile(i)}
                    />
                  </Box>
                ))}
            </Box>
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
          </Wrapper>
          <Wrapper display="flex" justifyContent="flex-end">
            <Button variant="contained" onClick={handleSubmit}>
              Save Change
            </Button>
          </Wrapper>
        </Paper>
      </Box>
    </Layout>
  );
};

export default Assignment;
