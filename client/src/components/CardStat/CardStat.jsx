import { Box, Paper, styled, Typography } from '@mui/material';
import React from 'react';

const Card = styled(Paper)(({ theme }) => ({
  padding: '24px 16px',
  flex: 1,
  transition: 'transform 250ms ease-out',
  '&:hover': {
    transform: 'scale(1.05)'
  }
}));

const CardStat = ({ Icon, title, total }) => {
  return (
    <Card>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h6">{title}</Typography>
          <Box px={1}>
            <Typography variant="body2">Total {total}</Typography>
          </Box>
        </Box>
        <Box>
          <Icon sx={{ fontSize: '36px' }} />
        </Box>
      </Box>
    </Card>
  );
};

export default CardStat;
