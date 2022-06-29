import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
  styled,
  Tooltip,
  Typography
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '../../../components/layouts/Layout';
import PaperCard from '../../../components/shared/Paper/PaperCard';
import { getAssignmentsBelongToCourse, getCourse } from '../../../http';
import TabsCustom from '../../../components/shared/Tabs/TabsCustom';

import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

import GolfCourseIcon from '@mui/icons-material/GolfCourse';
import BadgeDuration from './BadgeDuration';
import BadgeAvatar from './BadgeAvatar';
import SkeletonList from '../../../components/shared/Skeleton/SkeletonList';

const IntroWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: 24,
  width: '100%',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column'
  }
}));

const ContainerDetail = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '200px'
  },
  width: '400px',
  maxHeight: '150px',
  overflow: 'hidden',
  '&:hover': { overflow: 'auto' },
  transition: 'all 0.35s ease-in-out'
}));

const SingleCourse = () => {
  const [course, setCourse] = useState(null);
  const [assignments, setAssignment] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    const getCurrentCourse = async () => {
      try {
        setIsLoading(true);
        const res = await getCourse(id);
        setCourse(res.data.course);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getCurrentCourse();
  }, []);

  useEffect(() => {
    const getAssignments = async () => {
      try {
        const res = await getAssignmentsBelongToCourse(id);
        setAssignment(res.data.assignments);
      } catch (error) {
        console.log(error);
      }
    };
    getAssignments();
  }, []);

  return (
    <Layout>
      <Box width="100%" height="100%" p={3}>
        {isLoading ? (
          <SkeletonList />
        ) : (
          <>
            <Typography mb={3} variant="h4" component="h6">
              {course?.name}
            </Typography>
            <IntroWrapper>
              <PaperCard title="About" width="50%">
                <Box
                  position="absolute"
                  top={10}
                  right={10}
                  component={Link}
                  to={`/teacher/course/${id}/edit`}
                >
                  <Tooltip title="Edit">
                    <IconButton color="primary">
                      <AutoFixHighIcon />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Box my={3}>
                  <Typography mb={1}>Course begin</Typography>
                  {course?.date && <BadgeDuration dates={course.date} />}
                </Box>
                <Box my={2}>
                  <Typography>Professor</Typography>
                  <Box display="flex" flexWrap="wrap" gap={2}>
                    <BadgeAvatar course={course} />
                  </Box>
                </Box>
                <Divider />
                <ContainerDetail my={2} position="relative">
                  <Typography
                    variant="caption"
                    sx={{
                      minWidth: 0,
                      overflowWrap: 'break-word',
                      color: '#58595b'
                    }}
                  >
                    {course?.desc}
                  </Typography>
                </ContainerDetail>
              </PaperCard>
              <PaperCard title="Assignmnets" width="50%">
                <Typography>Lasted</Typography>
                <List
                  sx={{
                    width: '100%',
                    maxWidth: 360,
                    bgcolor: 'background.paper',
                    overflow: 'hidden',
                    maxHeight: 300,
                    height: 300
                  }}
                >
                  {assignments?.map((assignment, index) => (
                    <Box key={index}>
                      <ListItem alignItems="flex-start">
                        <ListItemIcon>
                          <GolfCourseIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2">
                              {assignment.title}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography
                                sx={{ display: 'inline', marginRight: '10px' }}
                                component="span"
                                variant="subtitle2"
                                color="text.primary"
                              >
                                Due to
                              </Typography>
                              {assignment.date}
                            </>
                          }
                        />
                      </ListItem>
                      {index !== 3 && <Divider variant="inset" />}
                    </Box>
                  ))}
                </List>
              </PaperCard>
            </IntroWrapper>
            <Box>
              <PaperCard title="Course Management" width="100%">
                <TabsCustom />
              </PaperCard>
            </Box>
          </>
        )}
      </Box>
    </Layout>
  );
};

export default SingleCourse;
