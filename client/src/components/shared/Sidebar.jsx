import {
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  styled,
  Typography
} from '@mui/material';

import { createStyles, makeStyles } from '@mui/styles';
import LogoutIcon from '@mui/icons-material/Logout';

import { Dashboard, MenuBook, Settings } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import { NavLink } from '../Links/NavLinkBase';
import { useCallback } from 'react';
import { logout } from '../../http';
import { setAuth } from '../../store/authSlice';

const useStyles = makeStyles(() =>
  createStyles({
    activeLink: {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
      borderRadius: '5px'
    }
  })
);

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const classes = useStyles();

  const Icon = styled(ListItemIcon)({
    width: 'fit-content'
  });

  const handleLogout = useCallback(async () => {
    await requestLogout();
  }, []);

  const requestLogout = async () => {
    try {
      await logout();
      dispatch(setAuth({ user: null }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      flex={1}
      p={1}
      sx={{
        display: { xs: 'none', sm: 'none', md: 'none', lg: 'block' }
      }}
    >
      <Box position="fixed" sx={{ width: 'inherit', maxWidth: 'inherit' }}>
        <List sx={{ width: '100%', fontSize: '12px' }}>
          <ListItem
            component={NavLink}
            to={`/${user.role}`}
            activeclassname={classes.activeLink}
            end
          >
            <ListItemIcon>
              <Icon>
                <Dashboard />
              </Icon>
              <ListItemText
                disableTypography
                primary={<Typography variant="body2">Home</Typography>}
              />
            </ListItemIcon>
          </ListItem>
          <ListItem
            component={NavLink}
            to={`/${user.role}/course`}
            activeclassname={classes.activeLink}
            end
          >
            <ListItemIcon>
              <Icon>
                <MenuBook />
              </Icon>
              <ListItemText
                disableTypography
                primary={<Typography variant="body2">Courses</Typography>}
              />
            </ListItemIcon>
          </ListItem>

          <ListItem
            component={NavLink}
            to={`/${user.role}/settings`}
            activeclassname={classes.activeLink}
            end
          >
            <ListItemIcon>
              <Icon>
                <Settings />
              </Icon>
              <ListItemText
                disableTypography
                primary={<Typography variant="body2">Settings</Typography>}
              />
            </ListItemIcon>
          </ListItem>
          <ListItem sx={{ cursor: 'pointer' }} onClick={handleLogout}>
            <ListItemIcon>
              <Icon>
                <LogoutIcon />
              </Icon>
              <ListItemText
                disableTypography
                primary={<Typography variant="body2">Logout</Typography>}
              />
            </ListItemIcon>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default React.memo(Sidebar);
