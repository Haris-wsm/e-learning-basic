import React from 'react';
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';

const objectList = [
  'Differentiate between file block and object storage',
  'Describe the function of Amazon EBS on AWS',
  'Explain important S3 concepts, such as S3 buckets and objects',
  'Explain when to use each AWS storage service'
];

const AccordianList = ({ purposes }) => {
  return (
    <Box>
      <Divider sx={{ margin: '5px 0' }} />
      <List>
        {purposes &&
          purposes.map((obj, i) => (
            <ListItem key={i}>
              <ListItemIcon>
                <FlagIcon />
              </ListItemIcon>
              <ListItemText
                disableTypography
                sx={{ fontSize: '14px' }}
                primary={obj}
                component="content"
              />
            </ListItem>
          ))}
      </List>
    </Box>
  );
};

export default AccordianList;
