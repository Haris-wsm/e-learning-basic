import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

const Navbar = () => {
  return (
    <Box
      position="sticky"
      sx={{
        top: 0,
        background: '#fff',
        boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
        zIndex: '9999'
      }}
    >
      <Box
        sx={{ height: 45, display: 'flex', gap: 2 }}
        p={1}
        justifyContent="center"
        alignItems="center"
      >
        <Box width={30}>
          <img src="/assets/Logo-branding.png" alt="logo-branding" />
        </Box>
        <Typography variant="p" component="h4">
          Academy
        </Typography>
      </Box>
    </Box>
  );
};

export default React.memo(Navbar);
