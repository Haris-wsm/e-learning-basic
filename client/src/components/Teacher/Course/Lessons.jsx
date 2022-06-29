import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import React, { useCallback, useState } from 'react';
import { lessonRows, lessonColumn } from '../../../data';
import { v4 as uuidv4 } from 'uuid';
import {
  createLesson,
  deleteLessonsBelongToCourse,
  getLessonBelongToCourse,
  updateLesson
} from '../../../http';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import AdditionInput from '../../shared/InputField/AdditionInput';

const initailState = { name: '', duration: '' };

const Lessons = ({ edit }) => {
  // Lessons states
  const [objectives, setObjectives] = useState([{ id: uuidv4() }]);
  const [data, setData] = useState(initailState);

  // Lesson table state
  const [lessonTable, setLessonTable] = useState([]);

  const [errors, setErrors] = useState(initailState);

  const { id } = useParams();

  //Data states for deletion from selection
  const [selected, setSelected] = useState([]);

  const handleAddObject = () => {
    setObjectives((prev) => [...prev, { id: uuidv4() }]);
  };

  const handleChangeObject = (id, value) => {
    setObjectives((prev) =>
      prev.map((o) => (o.id === id ? { ...o, objective: value } : o))
    );
  };

  const handleRemoveObjective = (id) => {
    setObjectives((prev) => prev.filter((o) => o.id !== id));
  };

  const resetData = () => {
    setErrors(initailState);
    setData(initailState);
    setObjectives([{ id: uuidv4() }]);
  };

  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    const requestBody = {
      name: data.name,
      duration: data.duration,
      purposes: objectives.map((o) => o.objective).filter((o) => o)
    };
    handleRequest(requestBody);
  };

  const handleRequest = async (data) => {
    try {
      await createLesson(data, id);

      resetData();

      toast.success('Created successful!');
      requestGetLessonTable();
    } catch (error) {
      const { status, data } = error.response;

      if (status === 400) {
        const { validationError } = data;
        setErrors((prev) => ({ ...prev, ...validationError }));
      }
      toast.error('Create failed!');
    }
  };

  useEffect(() => {
    requestGetLessonTable();
  }, []);

  const requestGetLessonTable = async () => {
    try {
      const res = await getLessonBelongToCourse(id, 'lesson');
      setLessonTable(res.data.lessons);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = () => {
    requestHandleDelete();
  };

  const requestHandleDelete = async () => {
    try {
      await deleteLessonsBelongToCourse(id, { ids: selected });
      requestGetLessonTable();
    } catch (error) {
      console.log(error);
    }
  };

  const handleRowEdit = useCallback((params) => {
    // console.log(params);
    const { id, field, value } = params;

    const data = { _id: id, [field]: value };
    requestUpdateRow(data);
  }, []);

  const requestUpdateRow = async (data) => {
    try {
      await updateLesson(id, data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        {edit && (
          <Box my={2} p={2} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="error"
              disabled={!selected.length}
              onClick={handleDelete}
            >{`Delete ${selected.length} items`}</Button>
          </Box>
        )}
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            disableSelectionOnClick
            rows={lessonTable}
            columns={lessonColumn}
            checkboxSelection={edit}
            onSelectionModelChange={(ids) => setSelected(ids)}
            onCellEditCommit={handleRowEdit}
            isCellEditable={() => edit}
          />
        </Box>
      </Paper>

      <Box my={4}>
        <Paper sx={{ padding: '16px 24px' }}>
          <Typography variant="h6">Create Lesson</Typography>

          <Box display="flex" gap={2}>
            <Box my={2} width="50%">
              <TextField
                id="outlined-video-title"
                label="Lesson Name"
                type="text"
                name="name"
                fullWidth
                size="small"
                onChange={handleChange}
                onFocus={(e) =>
                  setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
                }
                value={data?.name}
                helperText={errors.name && errors.name}
                error={!!errors.name}
              />
            </Box>
            <Box my={2} width="50%">
              <TextField
                id="outlined-video-title"
                label="Total Duration"
                type="text"
                name="duration"
                fullWidth
                size="small"
                value={data?.duration}
                onChange={handleChange}
                onFocus={(e) =>
                  setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
                }
                helperText={
                  errors.duration
                    ? errors.duration
                    : 'Total duration of this lesson in Hours'
                }
                error={!!errors.duration}
              />
            </Box>
          </Box>
          <Box my={2} width="100%">
            <Typography my={1} variant="subtitle2">
              Objective for learner
            </Typography>
            <Typography my={1} variant="subtitle2" sx={{ fontSize: '0.75rem' }}>
              Purpose of this lesson for learner to be able to complete
            </Typography>

            <AdditionInput
              objectives={objectives}
              handleChange={handleChangeObject}
              handleRemove={handleRemoveObjective}
            />
            <Box my={2} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                size="small"
                onClick={handleAddObject}
              >
                Add more
              </Button>
            </Box>
            <Box my={3} display="flex" justifyContent="center">
              <Button variant="contained" size="large" onClick={handleSubmit}>
                Create Lesson!
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default Lessons;
