import { Box, Button, Paper } from '@mui/material';
import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { assignmentColumn } from '../../../data';
import { useEffect } from 'react';
import { deleteAssignments } from '../../../http';

const AssignmentsTable = ({ edit, data, getAssignments }) => {
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (!edit) {
      setSelected([]);
    }
  }, [edit]);

  const handleDelete = async () => {
    try {
      await deleteAssignments({ ids: selected });
      await getAssignments();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box my={4}>
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
          columns={assignmentColumn}
          getRowId={(row) => row._id}
          checkboxSelection={edit}
          isCellEditable={() => edit}
          onSelectionModelChange={(ids) => setSelected(ids)}
        />
      </Box>
    </Box>
  );
};

export default AssignmentsTable;
