import { Box, Skeleton } from '@mui/material';
import React from 'react';

const SkeletonCard = ({ total }) => {
  const size = total || 6;
  return (
    <>
      {new Array(size).fill(true).map((_, index) => (
        <Box sx={{ pt: 0.5 }}>
          <Skeleton width={280} height={180} />
          <Skeleton width="100%" />
          <Skeleton width="60%" />
        </Box>
      ))}
    </>
  );
};

export default SkeletonCard;
