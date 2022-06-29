import React, { useState } from 'react';
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Modal,
  Typography
} from '@mui/material';

import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { useCallback } from 'react';
import VideoPlayer from '../../Video/VideoPlayer';
import CloseIcon from '@mui/icons-material/Close';
import { useParams } from 'react-router-dom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

const AccordianList = ({ lesson }) => {
  const [isOpen, seIsOpen] = useState(false);
  const [videoDetail, setVideoDetail] = useState({});
  const { id } = useParams();

  const handleClose = () => {
    seIsOpen(false);
  };

  const handleClickVideoButton = (info) => {
    setVideoDetail({ ...info, lesson: lesson._id });
    handleOpen();
  };

  const handleOpen = () => {
    seIsOpen(true);
  };

  const videoDuration = useCallback((duration) => {
    let messageWithUnit;

    if (!duration) {
      return;
    }

    duration = Number(duration);

    if (Math.floor(duration) === 0) {
      // if duration is less than 0 then convert duration into miniutes
      const miniutes = duration * 60;

      if (Math.floor(miniutes) > 0) {
        messageWithUnit = `${miniutes.toPrecision(3)} miniutes`;
      } else {
        const seconds = miniutes * 60;
        messageWithUnit = `${seconds.toPrecision(3)} seconds`;
      }

      return messageWithUnit;
    }

    messageWithUnit = `${duration.toPrecision(3)} hours`;

    return messageWithUnit;
  }, []);

  return (
    <>
      <Modal
        hideBackdrop
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-video"
        aria-describedby="child-modal-description"
      >
        <Box position="relative" sx={{ width: 600, ...style }} p={1}>
          <Typography variant="h6" id="modal-video" mb={2}>
            {videoDetail.filename}
          </Typography>
          <Box position="absolute" top={2} right={3}>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <VideoPlayer
            source={`http://localhost:5500/api/courses/${id}/lessons/${videoDetail.lesson}/video/${videoDetail.file}`}
          />
        </Box>
      </Modal>
      <List>
        {lesson &&
          lesson?.attachments.map((attachment) => (
            <ListItem
              secondaryAction={
                <IconButton edge="end" aria-label="delete">
                  <PlayCircleIcon
                    onClick={() => handleClickVideoButton(attachment)}
                  />
                </IconButton>
              }
              key={attachment._id}
            >
              <ListItemIcon>
                <VideoLibraryIcon />
              </ListItemIcon>
              <ListItemText
                disableTypography
                sx={{ fontSize: '14px' }}
                primary={attachment.title}
                secondary={
                  <Box sx={{ margin: '5px' }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ display: 'flex', alignItem: 'center' }}
                    >
                      Video
                      <Box sx={{ margin: '0 5px' }}>
                        <FiberManualRecordIcon sx={{ fontSize: '8px' }} />
                      </Box>
                      {videoDuration(attachment.duration)}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
      </List>
    </>
  );
};

export default React.memo(AccordianList);
