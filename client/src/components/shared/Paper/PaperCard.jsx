import React from 'react';
import { Paper, Typography } from '@mui/material';

const PaperCard = ({ children, title, width }) => {
  return (
    <Paper
      sx={{
        padding: '24px 24px',
        marginBottom: '16px',
        width: width,
        position: 'relative'
      }}
    >
      <Typography mb={4} sx={{ fontSize: '24px' }}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
};

export default PaperCard;
