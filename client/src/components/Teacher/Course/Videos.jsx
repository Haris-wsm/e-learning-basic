import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { vidoesColumn } from '../../../data';
import { DataGrid } from '@mui/x-data-grid';

import {
  Box,
  Button,
  IconButton,
  Modal,
  Paper,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VideoPlayer from '../../shared/Video/VideoPlayer';
import { useCallback } from 'react';
import { updateAttachment } from '../../../http';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

const Videos = (props) => {
  const { data, edit, selected, setSelected, handleDelete } = props;
  const { id } = useParams();

  //Data states
  const [isOpen, seIsOpen] = useState(false);
  const [videoDetail, setVideoDetail] = useState({});

  const hadleCellClick = (params, e) => {
    e.defaultMuiPrevented = true;

    if (params.field !== 'file') return;

    const { filename, file, lesson } = params.row;

    setVideoDetail({ filename, file, lesson: lesson._id });
    handleOpen();
  };

  const handleOpen = () => {
    seIsOpen(true);
  };
  const handleClose = () => {
    seIsOpen(false);
  };

  const handleRowEdit = useCallback((params) => {
    // console.log(params);
    const { id, field, value } = params;

    const data = { _id: id, [field]: value };
    requestUpdateRow(data);
  }, []);

  const requestUpdateRow = async (data) => {
    try {
      const res = await updateAttachment(data, id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {edit && (
        <Box my={2} p={2} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="error"
            disabled={!selected.length}
            onClick={handleDelete}
          >{`Delete ${selected.length} items`}</Button>
        </Box>
      )}
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          disableSelectionOnClick
          rows={data}
          columns={vidoesColumn}
          onCellClick={hadleCellClick}
          checkboxSelection={edit}
          onSelectionModelChange={(ids) => setSelected(ids)}
          onCellEditCommit={handleRowEdit}
          isCellEditable={() => edit}
        />
      </Box>

      <Modal
        hideBackdrop
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-video"
        aria-describedby="child-modal-description"
      >
        <Box position="relative" sx={{ width: 600, ...style }} p={1}>
          <Typography variant="h6" id="modal-video" mb={2}>
            {videoDetail.filename}
          </Typography>
          <Box position="absolute" top={2} right={3}>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <VideoPlayer
            source={`http://localhost:5500/api/courses/${id}/lessons/${videoDetail.lesson}/video/${videoDetail.file}`}
          />
        </Box>
      </Modal>
    </Paper>
  );
};

export default Videos;
