import { Box, Chip, Divider, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LayoutStudent from '../../components/layouts/Layout';
import { downLoadFile, getAssignmentById } from '../../http';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import fileDownload from 'js-file-download';

const AssignmentTask = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);

  useEffect(() => {
    const getAssignment = async () => {
      try {
        const res = await getAssignmentById(id);
        setAssignment(res.data.assignment);
      } catch (error) {
        console.log(error);
      }
    };
    getAssignment();
  }, []);

  const handleFileDownload = async (filename) => {
    try {
      const res = await downLoadFile(filename);

      fileDownload(res.data, filename);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <LayoutStudent>
      <Box width="100%" px={2}>
        <Paper sx={{ padding: '16px' }}>
          <Box my={2}>
            <Typography variant="h6">{assignment?.title}</Typography>
            <Divider sx={{ margin: '16px 0' }} />
            <Chip label={assignment?.type} sx={{ margin: '16px 0' }} />
          </Box>
          <Box my={3}>
            <Typography variant="body2">Description</Typography>
            <Divider sx={{ margin: '16px 0' }} />
            <Typography variant="body2">{assignment?.content}</Typography>
          </Box>
          <Box my={2}>
            <Typography variant="body2">Attached Files</Typography>
            <Divider sx={{ margin: '16px 0' }} />

            <Box my={2} px={2} display="flex" flexDirection="column">
              {assignment &&
                assignment?.attachments.map((attachment, i) => {
                  let [_, ...filename] = attachment.split('-');
                  filename = filename.join('-');

                  return (
                    <Chip
                      icon={<InsertDriveFileIcon />}
                      sx={{
                        cursor: 'pointer',
                        marginBottom: '8px',
                        width: 'max-content'
                      }}
                      label={filename}
                      component="span"
                      onClick={() => handleFileDownload(attachment)}
                      key={i}
                    />
                  );
                })}
            </Box>
          </Box>
        </Paper>
      </Box>
    </LayoutStudent>
  );
};

export default AssignmentTask;
