import {
  Autocomplete,
  Button,
  LinearProgress,
  Paper,
  styled,
  TextField,
  Typography
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import Videos from '../Course/Videos';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import { useParams } from 'react-router-dom';
import {
  deleteAttaments,
  getLessonBelongToCourse,
  uploadVideo
} from '../../../http';
import taost from 'react-hot-toast';
import { useEffect } from 'react';
import VideoPlayer from '../../shared/Video/VideoPlayer';

const Input = styled('input')({
  display: 'none'
});

const initailValue = {
  name: '',
  title: ''
};

const VideoUploader = ({ edit }) => {
  // State for the video uploader
  const [video, setVideo] = useState(null);
  const [data, setData] = useState(initailValue);
  const [errors, setErrors] = useState({ ...initailValue, video: '' });
  const [progress, setProgress] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams();

  // States for video table and lessons autocomplete
  const [lessons, setLessons] = useState([]);
  const [dataTable, setDataTable] = useState([]);

  //Data states for deletion from selection
  const [selected, setSelected] = useState([]);

  const requestDeleteCheckBox = async () => {
    try {
      await deleteAttaments({ ids: selected }, id);
      taost.success(`Delete ${selected.length} items success!!`);
      getVideoMetaBelongToCourse(id);
    } catch (error) {
      taost.error(`Delete ${selected.length} items fails!!`);
      console.log(error);
    }
  };

  const handleDeleteCheckBox = () => {
    requestDeleteCheckBox();
  };

  const handleSetVideo = (e) => {
    setVideo(e.target.files[0]);
  };

  function handleUploadVideo() {
    const formData = new FormData();

    if (isErros()) return;
    if (typeof data.name === 'object') {
      formData.append('name', data.name.label);
      formData.append('id', data.name._id);
    } else {
      formData.append('name', data.name);
    }
    formData.append('title', data.title);
    formData.append('courseRef', id);
    formData.append('video', video);
    uploadRequest(formData);
  }

  function isErros() {
    let count = 0;
    if (data.name === '') {
      setErrors((prev) => ({ ...prev, name: 'Must not be empty' }));
      count++;
    }

    if (data.title === '') {
      setErrors((prev) => ({ ...prev, title: 'Must not be empty' }));
      count++;
    }

    if (video === null) {
      setErrors((prev) => ({ ...prev, video: 'Must not be empty' }));
      count++;
    }

    if (count > 0) return true;
    return false;
  }

  async function uploadRequest(data) {
    try {
      setIsLoading(true);
      await uploadVideo(id, data, (persentage) => {
        setProgress(persentage);
      });
      taost.success('Upload Success!');
      setVideo(null);
      setData(initailValue);
      setProgress(0);
      setIsLoading(false);

      // Call api for video upload dataTable
      getVideoMetaBelongToCourse(id);
    } catch (error) {
      console.log(error);
      taost.error('Upload Fialed!');
    }
  }

  function handleChange(e, value) {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handeChangeAutoComplete(e, value) {
    setData((prev) => ({ ...prev, name: value }));
  }

  async function getLessonAutoComplete(courseId) {
    try {
      const res = await getLessonBelongToCourse(courseId);
      setLessons(res.data.lessons);
    } catch (error) {
      console.log(error);
    }
  }

  async function getVideoMetaBelongToCourse(courseId) {
    try {
      const res = await getLessonBelongToCourse(
        courseId,
        'video',
        (persentage) => console.log(persentage)
      );

      setDataTable(res.data.lessons);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getLessonAutoComplete(id);
    getVideoMetaBelongToCourse(id);
  }, []);

  return (
    <>
      <Videos
        data={dataTable}
        edit={edit}
        selected={selected}
        setSelected={setSelected}
        handleDelete={handleDeleteCheckBox}
      />
      <Box my={4}>
        <Paper sx={{ padding: '16px 24px' }}>
          <Typography variant="h6">Upload Video</Typography>

          <Box my={2} width="50%">
            <TextField
              id="outlined-video-title"
              label="Video Title"
              type="text"
              name="title"
              fullWidth
              value={data.title}
              onChange={handleChange}
              onFocus={(e) =>
                setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
              }
              size="small"
              helperText={errors.title ? errors.title : ''}
              error={!!errors.title}
            />
          </Box>
          <Box my={2} width="50%">
            <Autocomplete
              disablePortal
              freeSolo
              id="combo-box-demo"
              options={lessons}
              // key={data.name || 'justRandomKey'}
              value={data.name}
              // defaultValue={data.name}
              onChange={handeChangeAutoComplete}
              disableClearable
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chapter"
                  helperText="Charpter of lessons for a video"
                  name="name"
                  // onChange={handleChange}
                  value={data.name}
                  onFocus={(e) =>
                    setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
                  }
                  error={!!errors.name}
                  size="small"
                />
              )}
            />
          </Box>
          <Box my={1}>
            {video && (
              <Box mb={2}>
                <VideoPlayer
                  source={URL.createObjectURL(video)}
                  type={video?.type}
                />
              </Box>
            )}

            {/* Removal a Video file Button, if Video file has been uploaded then display this  */}
            <Box display="flex" gap={2} width="50%">
              {video ? (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setVideo(null)}
                  startIcon={<ContentCutIcon />}
                >
                  Remove
                </Button>
              ) : (
                <label htmlFor="contained-button-file">
                  <Input
                    accept="video/*"
                    id="contained-button-file"
                    // multiple
                    type="file"
                    onChange={handleSetVideo}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<VideoLibraryIcon />}
                    component="span"
                  >
                    Choose File
                  </Button>
                </label>
              )}
            </Box>
            {!!progress && (
              <Box my={2} sx={{ width: '100%' }}>
                <LinearProgressWithLabel value={progress} />
              </Box>
            )}
            <Box my={3} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                sizr="large"
                onClick={handleUploadVideo}
                disabled={isLoading}
              >
                Create Video
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default VideoUploader;

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography
          variant="body2"
          color="text.secondary"
        >{`${props.value}%`}</Typography>
      </Box>
    </Box>
  );
}
