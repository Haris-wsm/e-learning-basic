import { Box } from '@mui/material';
import React from 'react';

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

const VideoPlayer = (props) => {
  const { source } = props;
  return (
    <Box
      width="100%"
      sx={{ paddingTop: '56.25%', height: 0, position: 'relative' }}
    >
      <video
        controls
        autoPlay
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      >
        <source src={source} {...props} />
      </video>
    </Box>
  );
};

export default VideoPlayer;
