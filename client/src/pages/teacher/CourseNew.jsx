import styled from '@emotion/styled';
import { Button, CircularProgress, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { useState } from 'react';

import AutoCompleteCustom from '../../components/shared/InputField/AutoCompleteCustom';

// TIme picker
import TimePickerForm from '../../components/shared/Timepicker/TimePickerForm';

// Container
import Layout from '../../components/layouts/Layout';
import PaperCard from '../../components/shared/Paper/PaperCard';
import InputField from '../../components/shared/InputField/Input';

// library
import { v4 as uuidv4 } from 'uuid';

// icons
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { createCourse } from '../../http';

// toast
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Input = styled('input')({
  display: 'none'
});

const CourseNew = () => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [timeFields, serTimeFields] = useState([{ id: uuidv4() }]);
  const [professers, setProfessers] = useState([]);
  // image
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  function addTimePickerField() {
    serTimeFields((prev) => [...prev, { id: uuidv4() }]);
  }

  function removeTimePickerField(id) {
    if (timeFields.length === 1) return;
    serTimeFields((prev) => prev.filter((field) => field.id !== id));
  }

  function handleChangePickers(id, data) {
    serTimeFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, ...data } : field))
    );
  }

  function handleFileChange(e) {
    setImage(e.target.files[0]);
  }

  function handleSubmit() {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('desc', desc);
    formData.append('date', JSON.stringify(timeFields));
    formData.append('professers', JSON.stringify(professers));
    if (image) {
      formData.append('image', image);
    }

    requestCreateCourse(formData);
  }

  async function requestCreateCourse(data) {
    try {
      const res = await createCourse(data);
      toast.success('Create success!');
      navigate(`/teacher/course/${res.data.course._id}`);
    } catch (err) {
      console.log(err);
      toast.error('Create failed!');
    }
  }

  return (
    <Layout>
      <Box width="90%" height="100%" py={3}>
        <Typography mb={3} variant="h6" component="h6">
          New Course
        </Typography>
        <PaperCard title="Summary Info">
          <InputField
            label="Course Name"
            type="text"
            value={name}
            setValue={setName}
            width="50%"
            my={2}
          />

          <AutoCompleteCustom
            label="Associate Professor"
            placeholder="Add professer"
            my={3}
            width="50%"
            setData={setProfessers}
          />

          <InputField
            label="Course Detail"
            type="text"
            value={desc}
            setValue={setDesc}
            rows={7}
            multiline
            my={2}
          />

          <Box
            m={3}
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ flexDirection: 'column' }}
          >
            <Box my={3}>
              <Box width="200px">
                <Box>
                  <img
                    src={
                      image
                        ? URL.createObjectURL(image)
                        : '/assets/users/user-1.jpg'
                    }
                    alt="thumbnail-course"
                    style={{
                      height: 'auto',
                      width: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </Box>
              </Box>
            </Box>
            <label htmlFor="contained-button-file">
              <Input
                accept="image/*"
                id="contained-button-file"
                multiple
                type="file"
                onChange={handleFileChange}
              />
              <Button
                variant="contained"
                component="span"
                endIcon={<AddPhotoAlternateIcon />}
              >
                Upload Thumbnail
              </Button>
            </label>
          </Box>
        </PaperCard>

        <PaperCard title="Date and time">
          {timeFields.map((field) => (
            <TimePickerForm
              key={field.id}
              unique={field.id}
              remove={removeTimePickerField}
              setPicker={handleChangePickers}
              isMultiple={timeFields.length > 1}
            />
          ))}

          <Box display="flex" justifyContent="flex-end" px={3}>
            <Button
              variant="contained"
              size="small"
              onClick={addTimePickerField}
            >
              Add Date
            </Button>
          </Box>
        </PaperCard>
        <Box py={3} display="flex" justifyContent="flex-end">
          <Button variant="contained" size="large" onClick={handleSubmit}>
            Create New Course
          </Button>
        </Box>
      </Box>
    </Layout>
  );
};

export default CourseNew;
