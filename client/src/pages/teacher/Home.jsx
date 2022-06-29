import { Box, Paper, styled, Typography } from '@mui/material';
import React, { useState } from 'react';
import Layout from '../../components/layouts/Layout';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CardStat from '../../components/CardStat/CardStat';
import { useEffect } from 'react';
import { getStat } from '../../http';

const CardWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: '0 16px',
  gap: 16,
  [theme.breakpoints.down('md')]: { display: 'flex', flexDirection: 'column' }
}));

const Home = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const getStatistic = async () => {
      try {
        const res = await getStat();
        setStats(res.data.stats);
      } catch (error) {
        console.log(error);
      }
    };
    getStatistic();
  }, []);

  return (
    <Layout>
      <Box width="100%">
        <CardWrapper my={2} px={2}>
          <CardStat
            title="Course"
            total={stats?.course || 0}
            Icon={MenuBookIcon}
          />
          <CardStat
            title="Assignment"
            total={stats?.assignments || 0}
            Icon={AssignmentIcon}
          />
          <CardStat
            title="Students"
            total={stats?.students || 0}
            Icon={SchoolIcon}
          />
        </CardWrapper>
      </Box>
    </Layout>
  );
};

export default Home;
