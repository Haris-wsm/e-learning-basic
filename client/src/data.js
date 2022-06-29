import { Button, IconButton } from '@mui/material';
import SlowMotionVideoIcon from '@mui/icons-material/SlowMotionVideo';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { Link } from 'react-router-dom';

export const vidoesColumn = [
  {
    field: 'title',
    headerName: 'Title',
    flex: 1,
    editable: true
  },
  {
    field: 'file',
    headerName: 'Preview',
    width: 100,
    flex: 1,
    editable: false,
    renderCell: (params) => (
      <Button
        variant="text"
        color="error"
        size="small"
        endIcon={<SlowMotionVideoIcon />}
      >
        Video
      </Button>
    )
  },
  { field: 'filename', headerName: 'Filename', flex: 1, editable: true },
  {
    field: 'lesson',
    headerName: 'Lesson',
    flex: 1,
    editable: false,
    renderCell: ({ row }) => row.lesson.name
  },
  {
    field: 'adder',
    headerName: 'Add By',
    flex: 1,
    editable: false
  },
  {
    field: 'duration',
    headerName: 'Duration',
    minWidth: 120,
    renderCell: ({ row }) => {
      // row.duration is base in hours unit
      return getDurationMessage(row.duration);
    }
  },
  {
    field: 'createdAt',
    headerName: 'Create On',
    flex: 1,
    editable: true,
    renderCell: ({ row }) => new Date(row.createdAt).toDateString()
  }
];

function getDurationMessage(duration) {
  let messageWithUnit;

  if (!duration) {
    return;
  }

  duration = Number(duration);

  if (Math.floor(duration) === 0) {
    // if duration is less than 0 then convert duration into miniutes
    const miniutes = duration * 60;

    if (Math.floor(miniutes) > 0) {
      messageWithUnit = `${miniutes.toPrecision(3)} miniutes`;
    } else {
      const seconds = miniutes * 60;
      messageWithUnit = `${seconds.toPrecision(3)} seconds`;
    }

    return messageWithUnit;
  }

  messageWithUnit = `${duration.toPrecision(3)} hours`;

  return messageWithUnit;
}

export const lessonColumn = [
  {
    field: 'name',
    headerName: 'Lesson Name',
    minWidth: 170,
    flex: 1,
    editable: true
  },
  {
    field: 'duration',
    headerName: 'Duration',
    minWidth: 100,
    flex: 1,
    editable: true,
    renderCell: ({ row }) => `${row.duration} hours`
  },
  {
    field: 'adder',
    headerName: 'Add By',
    minWidth: 100,
    flex: 1
  },
  {
    field: 'createdAt',
    headerName: 'Create On',
    minWidth: 170,
    renderCell: ({ row }) => new Date(row.createdAt).toDateString(),
    flex: 1
  },
  {
    field: 'edit',
    headerName: 'Fix',
    minWidth: 170,
    flex: 1,
    sortable: false,
    renderCell: (props) => {
      const { row } = props;
      return (
        <IconButton component={Link} to={`/teacher/lesson/${row._id}/edit`}>
          <AutoFixHighIcon />
        </IconButton>
      );
    }

    // editable: true
  }
];

export const assignmentColumn = [
  {
    field: 'title',
    headerName: 'Assignment Name',
    minWidth: 170,
    flex: 1,
    editable: true
  },
  {
    field: 'date',
    headerName: 'Date',
    minWidth: 170,
    flex: 1,
    editable: true
  },
  {
    field: 'edit',
    headerName: 'Fix',
    minWidth: 170,
    flex: 1,
    sortable: false,
    renderCell: (props) => {
      const { row } = props;
      return (
        <IconButton component={Link} to={`/teacher/assignment/${row._id}/edit`}>
          <AutoFixHighIcon />
        </IconButton>
      );
    }

    // editable: true
  }
];
