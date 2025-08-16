/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Button,
  alpha,
} from '@mui/material';
import {
  Search as SearchIcon,
  Home as HomeIcon,
  LibraryMusic as LibraryMusicIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
}));

const Header = ({ isAuthenticated = false }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    handleMenuClose();
    navigate('/');
  };


  const isMenuOpen = Boolean(anchorEl);

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AppBar 
        position="static" 
        sx={{ 
          backgroundColor: 'secondary.main',
          width: '100%',
          left: 0,
          right: 0,
        }}
      >
        <Toolbar sx={{ width: '100%', maxWidth: 'none', px: 3 }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Typography
              variant="h5"
              component="div"
              sx={{
                flexGrow: 0,
                fontWeight: 700,
                color: 'primary.main',
                cursor: 'pointer',
                mr: 4,
              }}
              onClick={() => handleNavigation(isAuthenticated ? '/home' : '/')}
            >
              🎵 MusicStream
            </Typography>
          </motion.div>

          {isAuthenticated && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <IconButton
                  color="inherit"
                  onClick={() => handleNavigation('/home')}
                  sx={{
                    mr: 1,
                    backgroundColor: location.pathname === '/home' ? 'primary.main' : 'white',
                  }}
                >
                  <HomeIcon />
                </IconButton>
                <IconButton
                  color="inherit"
                  onClick={() => handleNavigation('/songs')}
                  sx={{
                    backgroundColor: location.pathname === '/songs' ? 'primary.main' : 'white',
                  }}
                >
                  <LibraryMusicIcon />
                </IconButton>
              </Box>
            </>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {isAuthenticated ? (
            <Box>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="primary-search-account-menu"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  <PersonIcon />
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                id="primary-search-account-menu"
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={isMenuOpen}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => { handleNavigation('/profile'); handleMenuClose(); }}>
                  <PersonIcon sx={{ mr: 1 }} />
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  color="inherit"
                  onClick={() => handleNavigation('/login')}
                  sx={{ 
                    color: 'white',
                    textTransform: 'none',
                    fontSize: '16px',
                    fontWeight: 500,
                    px: 2,
                    py: 1,
                  }}
                >
                  Login
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  onClick={() => handleNavigation('/signup')}
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    textTransform: 'none',
                    fontSize: '16px',
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    borderRadius: 25,
                    '&:hover': { bgcolor: 'primary.dark' },
                  }}
                >
                  Sign Up
                </Button>
              </motion.div>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </motion.div>
  );
};

export default Header;