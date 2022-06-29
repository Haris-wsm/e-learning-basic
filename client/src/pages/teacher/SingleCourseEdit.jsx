import { Button, styled, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect } from 'react';
import Layout from '../../components/layouts/Layout';
import PaperCard from '../../components/shared/Paper/PaperCard';
import InputField from '../../components/shared/InputField/Input';
import { useState } from 'react';
import { getCourseById, updateCourse } from '../../http';
import { useParams } from 'react-router-dom';
import AutoCompleteCustom from '../../components/shared/InputField/AutoCompleteCustom';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import TimePickerForm from '../../components/shared/Timepicker/TimePickerForm';
import toast from 'react-hot-toast';
// library
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

const Input = styled('input')({
  display: 'none'
});

const SingleCourseEdit = () => {
  const [course, setCourse] = useState(null);

  // Header title course, for seperated from change
  const [courseName, setCourseName] = useState('');

  // form state
  const [professers, setProfessers] = useState([]);
  const [image, setImage] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    requestGetCourse();
  }, []);

  const requestGetCourse = async () => {
    try {
      const res = await getCourseById(id);

      const {
        data: { course }
      } = res;

      setCourseName(course.name);
      setCourse(course);
      setProfessers(course?.professers?.map((prof) => prof.id));
    } catch (error) {
      console.log(error);
    }
  };

  function handleSubmit() {
    const formData = new FormData();
    formData.append('name', course.name);
    formData.append('desc', course.desc);
    formData.append('date', JSON.stringify(course.date));

    formData.append('professers', JSON.stringify(professers));

    if (image) {
      formData.append('image', image);
    }

    requestUpdateCourse(formData);
  }

  async function requestUpdateCourse(data) {
    try {
      await updateCourse(data, id);
      toast.success('Update success!');
    } catch (err) {
      console.log(err);
      toast.error('Update failed!');
    }
  }

  const handleChange = (name) => {
    return (value) => {
      setCourse((prev) => ({ ...prev, [name]: value }));
    };
  };

  function addTimePickerField() {
    setCourse((prev) => ({
      ...prev,
      date: [
        ...prev.date,
        {
          _id: uuidv4(),
          day: 'Monday',
          start: dayjs(new Date()).format('HH:mm A'),
          end: dayjs(new Date()).format('HH:mm A')
        }
      ]
    }));
  }

  function handleFileChange(e) {
    setImage(e.target.files[0]);
  }

  function removeTimePickerField(id) {
    if (course?.date.length === 1) return;
    setCourse((prev) => ({
      ...prev,
      date: prev.date.filter((field) => field._id !== id)
    }));
  }

  function handleChangePickers(id, data) {
    const key = Object.keys(data)[0];
    const value = Object.values(data)[0];

    setCourse((prev) => ({
      ...prev,
      date: prev.date.map((field) =>
        field._id === id ? { ...field, [key]: value } : field
      )
    }));
  }

  return (
    <Layout>
      <Box width="90%" height="100%" py={3}>
        <Typography mb={3} variant="h6" component="h6">
          {courseName}
        </Typography>
        <PaperCard title="Summary Info">
          <InputField
            label="Course Name"
            type="text"
            value={course?.name || ''}
            setValue={handleChange('name')}
            width="50%"
            my={2}
          />
          <AutoCompleteCustom
            label="Associate Professor"
            placeholder="Add professer"
            my={3}
            width="50%"
            setData={setProfessers}
            initail={course?.professers}
          />

          <InputField
            label="Course Detail"
            type="text"
            value={course?.desc || ''}
            setValue={handleChange('desc')}
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
                    src={image ? URL.createObjectURL(image) : course?.image}
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
          {course?.date.map((field) => (
            <TimePickerForm
              key={field._id}
              unique={field._id}
              remove={removeTimePickerField}
              setPicker={handleChangePickers}
              isMultiple={course?.date.length > 1}
              initailDate={field}
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
            Save Change
          </Button>
        </Box>
      </Box>
    </Layout>
  );
};

export default SingleCourseEdit;
