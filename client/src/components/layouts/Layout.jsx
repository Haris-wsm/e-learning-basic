import { Box } from '@mui/material';
import React from 'react';
import Navbar from '../shared/Navbar';
import Sidebar from '../shared/Sidebar';

const Layout = ({ children }) => {
  return (
    <Box>
      <Navbar />
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box sx={{ flex: 6, display: 'flex', marginTop: '16px' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
