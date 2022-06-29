import { DataGrid } from '@mui/x-data-grid';
import { Avatar, Box, Chip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getCourseByFilter } from '../../http';
import UpdateIcon from '@mui/icons-material/Update';

const columns = [
  // { field: 'id', hide: true },
  {
    field: 'name',
    headerName: 'Course Name',
    width: 150
    //  flex: 1
  },
  {
    field: 'professer',
    headerName: 'Professer',
    width: 200,
    // flex: 1,
    renderCell: ({ row }) => {
      const { owner } = row;
      return (
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            gap: '10px',
            alignItems: 'flex-start',
            padding: '8px 0'
          }}
        >
          <Avatar src={owner.image} />
          <Box sx={{}}>
            <Typography variant="subtitle2" component="span">
              {owner.username}
            </Typography>
            <Typography variant="content" component="p">
              {owner.subject}
            </Typography>
          </Box>
        </Box>
      );
    }
  },
  {
    field: 'date',
    headerName: 'Begin',
    width: 350,
    // flex: 1,
    renderCell: ({ row }) => {
      const { date: dates } = row;

      return (
        <Box display="flex" sx={{ maxWidth: '400px', flexWrap: 'wrap' }}>
          {dates.map((date, i) => (
            <Chip
              label={`${date.day} ${date.start} ${date.end}`}
              deleteIcon={<UpdateIcon />}
              sx={{ margin: '8px 0' }}
              key={i}
            />
          ))}
        </Box>
      );
    }
  }
];

export default function CourseTable() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const getMyCourse = async () => {
      try {
        const res = await getCourseByFilter('me');
        setCourses(res.data.courses);
      } catch (error) {
        console.log(error);
      }
    };
    getMyCourse();
  }, []);

  return (
    <div style={{ width: '700px', padding: '10px' }}>
      <DataGrid
        rows={courses}
        columns={columns}
        autoHeight
        hideFooterPagination
        hideFooterSelectedRowCount
        hideFooter
        getRowHeight={() => 'auto'}
        getRowId={(row) => row._id}
      />
    </div>
  );
}
