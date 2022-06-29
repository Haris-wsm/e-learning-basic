import {
  Box,
  Button,
  Paper,
  styled,
  TextField,
  Typography
} from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import Layout from '../../../components/layouts/Layout';
import { v4 as uuidv4 } from 'uuid';
import AdditionInput from '../../../components/shared/InputField/AdditionInput';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getLessonById, updateLessonById } from '../../../http';
import toast from 'react-hot-toast';

const Wrapper = styled(Box)(({ theme }) => ({
  width: '50%',
  margin: '16px',
  padding: '0px 16px',

  [theme.breakpoints.down('sm')]: {
    width: '100%'
  }
}));

const initailErrorMessage = { name: '', duration: '' };

const LessonEdit = () => {
  const [objectives, setObjectives] = useState([{ id: uuidv4() }]);
  const [lesson, setLesson] = useState(null);

  // Erros handler
  const [errors, setErrors] = useState(initailErrorMessage);
  const { id } = useParams();

  // const handleChange = (id, value) => {
  //   setObjectives((prev) =>
  //     prev.map((o) => (o.id === id ? { ...o, objective: value } : o))
  //   );
  // };

  const objectivesMemo = useMemo(() => {
    return objectives;
  }, [objectives, setObjectives]);

  const handleChange = useCallback((id, value) => {
    setObjectives((prev) =>
      prev.map((o) => (o.id === id ? { ...o, objective: value } : o))
    );
  }, []);

  // const handleRemove = (id) => {
  //   setObjectives((prev) => prev.filter((o) => o.id !== id));
  // };

  const handleRemove = useCallback((id) => {
    setObjectives((prev) => prev.filter((o) => o.id !== id));
  }, []);

  // const handleAddObject = () => {
  //   setObjectives((prev) => [...prev, { id: uuidv4() }]);
  // };

  const handleAddObject = useCallback(() => {
    setObjectives((prev) => [...prev, { id: uuidv4() }]);
  }, []);

  const handleChangeState = (e) => {
    setLesson((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const body = {
      _id: id,
      name: lesson.name,
      duration: lesson.duration,
      purposes: objectives
        .filter((item) => item.objective)
        .map((item) => item.objective)
    };

    try {
      const res = await updateLessonById(id, body);
      toast.success('Update Lesson Successful!');
    } catch (error) {
      const { validationError } = error.response.data;
      toast.error('Update Lesson Failed!');
      setErrors((prev) => ({ ...prev, ...validationError }));

      console.log(error.response.data);
    }
  };

  useEffect(() => {
    const getLesson = async () => {
      try {
        const res = await getLessonById(id);
        setLesson(res.data.lesson);
        const listFromRequest = res.data.lesson.purposes.map((list) => ({
          id: uuidv4(),
          objective: list
        }));

        setObjectives((prev) => [...listFromRequest, ...prev]);
      } catch (error) {
        console.log(error);
      }
    };
    getLesson();
  }, []);

  return (
    <Layout>
      <Box p={2} width="100%">
        <Paper sx={{ padding: '16px' }}>
          <Wrapper>
            <Typography>Change Lesson Info</Typography>
          </Wrapper>
          <Wrapper>
            <TextField
              label="Lesson Name"
              helperText={!!errors.name ? errors.name : 'Assign Lesson title'}
              error={!!errors.name}
              fullWidth
              size="small"
              name="name"
              value={lesson?.name || ''}
              onChange={handleChangeState}
            />
          </Wrapper>
          <Wrapper>
            <TextField
              label="Duration"
              helperText={
                !!errors.duration
                  ? errors.duration
                  : 'Total duration of this lesson in Hours'
              }
              error={!!errors.duration}
              fullWidth
              size="small"
              name="duration"
              value={lesson?.duration || ''}
              onChange={handleChangeState}
            />
          </Wrapper>
          <Wrapper>
            <AdditionInput
              handleChange={handleChange}
              handleRemove={handleRemove}
              objectives={objectivesMemo}
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
          </Wrapper>
          <Box display="flex" justifyContent="flex-end" width="100%" p={2}>
            <Button variant="contained" size="large" onClick={handleSubmit}>
              Save Change
            </Button>
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
};

export default LessonEdit;
