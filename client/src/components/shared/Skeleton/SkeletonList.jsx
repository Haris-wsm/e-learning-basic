import { Box, Skeleton, Typography } from '@mui/material';
import React from 'react';

const SkeletonList = () => {
  return (
    <Box my={2}>
      <SkeletonHeader />
      <Box display="flex">
        <Box display="flex">
          <SkeletonUser />
          <SkeletonUser />
          <SkeletonUser />
        </Box>
      </Box>

      <Box my={5}>
        <Typography variant="h2">
          <Skeleton width="90%" />
        </Typography>
        <Typography variant="h2">
          <Skeleton width="90%" />
        </Typography>
        <Typography variant="h2">
          <Skeleton width="90%" />
        </Typography>
      </Box>
    </Box>
  );
};

const SkeletonHeader = () => (
  <Box my={4}>
    <Typography variant="h1">
      <Skeleton width="75%" />
    </Typography>
    <Skeleton width="50%" height={20} />
    <Skeleton width="50%" height={20} />
  </Box>
);

const SkeletonUser = () => {
  return (
    <Box mx={1} display="flex" alignItems="center">
      <Skeleton animation="wave" variant="circular" width={40} height={40} />
      <Box>
        <Skeleton animation="wave" height={10} width="100px" />
        <Skeleton animation="wave" height={10} width="100px" />
        <Skeleton animation="wave" height={10} width="100px" />
      </Box>
    </Box>
  );
};

export default SkeletonList;
