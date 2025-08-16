/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  MusicNote as MusicIcon,
  Favorite as FavoriteIcon,
  PlaylistPlay as PlaylistIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Header from '../components/Header';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [apiError, setApiError] = useState('');
  const [statsError, setStatsError] = useState('');
  const [profileData, setProfileData] = useState({
    _id: '',
    username: '',
    email: '',
    bio: 'Music lover and playlist curator. Always discovering new sounds and sharing great music with friends.',
    location: 'India',
    joinDate: '',
    favorites: [],
    listened: [],
  });

  const [statsData, setStatsData] = useState({
    totalSongsPlayed: 0,
    totalFavorites: 0,
    totalPlaylists: 0,
    listeningTime: 0,
    topGenres: [],
    monthlyStats: [],
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    publicProfile: true,
    showListeningActivity: true,
  });

  const [editData, setEditData] = useState(profileData);

  // Fetch profile data from API
  useEffect(() => {
    const fetchProfileData = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        setApiError('You must be signed in to view your profile.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/profile/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to load profile (${response.status})`);
        }

        const data = await response.json();
        
        // Update profile data with API response
        setProfileData(prev => ({
          ...prev,
          _id: data._id || '',
          username: data.username || '',
          email: data.email || '',
          favorites: data.favorites || [],
          listened: data.listened || [],
          joinDate: data.createdAt || '',
        }));
        
        // Also update edit data
        setEditData(prev => ({
          ...prev,
          _id: data._id || '',
          username: data.username || '',
          email: data.email || '',
          favorites: data.favorites || [],
          listened: data.listened || [],
        }));

        // Fetch stats data
        await fetchStatsData(token);
      } catch (error) {
        setApiError(error.message || 'Failed to load profile data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Fetch stats data from API
  const fetchStatsData = async (token) => {
    setIsLoadingStats(true);
    setStatsError('');
    try {
      const response = await fetch('/api/stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Stats API error (${response.status})`;
        setStatsError(errorMessage);
        console.warn('Failed to load stats:', errorMessage);
        return;
      }

      const data = await response.json();
      
      // Update stats data with API response
      setStatsData({
        totalSongsPlayed: data.totalPlays || 0,
        totalFavorites: data.favoritesCount || 0,
        totalPlaylists: data.totalPlaylists || 1,
        listeningTime: data.songsListened || 0,
        topGenres: data.topGenres || [],
        monthlyStats: data.monthlyStats || [],
      });
    } catch (error) {
      const errorMessage = error.message || 'Failed to load stats data.';
      setStatsError(errorMessage);
      console.warn('Failed to load stats data:', errorMessage);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(profileData);
  };

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value,
    }));
  };

  // Format date to show only month and year
  const formatJoinDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      });
    } catch (error) {
      return dateString; 
    }
  };

  const userStats = [
    { label: 'Songs Played', value: statsData.totalSongsPlayed.toString(), icon: <MusicIcon /> },
    { label: 'Favorites', value: statsData.totalFavorites.toString(), icon: <FavoriteIcon /> },
    { label: 'Playlists', value: statsData.totalPlaylists.toString(), icon: <PlaylistIcon /> },
  ];

  const favoriteSongs = [
    {
      id: 1,
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    {
      id: 2,
      title: 'Watermelon Sugar',
      artist: 'Harry Styles',
      image: 'https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    {
      id: 3,
      title: 'Levitating',
      artist: 'Dua Lipa',
      image: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (apiError) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Header isAuthenticated={true} />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ fontSize: '1.1rem' }}>
            {apiError}
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header isAuthenticated={true} />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={4}>
            {/* Profile Information */}
            <Grid item xs={12} md={8}>
              <motion.div variants={itemVariants}>
                <Card sx={{ mb: 4 }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                      <Avatar
                        sx={{
                          width: 100,
                          height: 100,
                          mr: 3,
                          bgcolor: 'primary.main',
                          fontSize: '2rem',
                        }}
                      >
                        {profileData.username ? profileData.username[0]?.toUpperCase() : 'U'}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h4" component="h1">
                            {profileData.username || 'User'}
                          </Typography>
                          <Chip
                            label="Premium"
                            color="primary"
                            size="small"
                            sx={{ ml: 2 }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Member since {formatJoinDate(profileData.joinDate)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          📍 {profileData.location}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          🆔 {profileData._id}
                        </Typography>
                      </Box>
                      <Button
                        variant={isEditing ? "outlined" : "contained"}
                        startIcon={isEditing ? <CancelIcon /> : <EditIcon />}
                        onClick={isEditing ? handleCancel : handleEdit}
                        sx={{ ml: 2 }}
                      >
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                      </Button>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {isEditing ? (
                      <Box component="form" sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Username"
                              value={editData.username}
                              onChange={(e) => handleInputChange('username', e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Location"
                              value={editData.location}
                              onChange={(e) => handleInputChange('location', e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Email"
                              type="email"
                              value={editData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              disabled
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Bio"
                              multiline
                              rows={3}
                              value={editData.bio}
                              onChange={(e) => handleInputChange('bio', e.target.value)}
                            />
                          </Grid>
                        </Grid>
                        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                          <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSave}
                          >
                            Save Changes
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<CancelIcon />}
                            onClick={handleCancel}
                          >
                            Cancel
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          About
                        </Typography>
                        <Typography variant="body1" paragraph>
                          {profileData.bio}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          📧 {profileData.email}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Settings */}
              <motion.div variants={itemVariants}>
                <Card>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <SettingsIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h5" component="h2">
                        Settings
                      </Typography>
                    </Box>

                    <List>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <NotificationsIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Email Notifications"
                          secondary="Receive updates about new music and features"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings.emailNotifications}
                            onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>

                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'secondary.main' }}>
                            <NotificationsIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Push Notifications"
                          secondary="Get notified about new releases from your favorite artists"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings.pushNotifications}
                            onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>

                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'success.main' }}>
                            <SecurityIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Public Profile"
                          secondary="Allow others to see your profile and playlists"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings.publicProfile}
                            onChange={(e) => handleSettingChange('publicProfile', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>

                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'info.main' }}>
                            <MusicIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Show Listening Activity"
                          secondary="Let friends see what you're currently listening to"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings.showListeningActivity}
                            onChange={(e) => handleSettingChange('showListeningActivity', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} md={4}>
              {/* Stats */}
              <motion.div variants={itemVariants}>
                <Card sx={{ mb: 4 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Your Stats
                      </Typography>
                      <IconButton 
                        onClick={() => {
                          const token = sessionStorage.getItem('token');
                          if (token) fetchStatsData(token);
                        }} 
                        size="small" 
                        color="primary"
                        disabled={isLoadingStats}
                      >
                        {isLoadingStats ? <CircularProgress size={20} /> : <RefreshIcon />}
                      </IconButton>
                    </Box>
                    <List>
                      {userStats.map((stat, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              {stat.icon}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={stat.value}
                            secondary={stat.label}
                          />
                        </ListItem>
                      ))}
                    </List>
                    
                    {statsError && (
                      <Alert severity="warning" sx={{ mt: 2, fontSize: '0.875rem' }}>
                        {statsError}
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </motion.div>


              {/* Favorite Songs
              <motion.div variants={itemVariants}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Recent Favorites
                    </Typography>
                    {profileData.favorites && profileData.favorites.length > 0 ? (
                      <List>
                        {profileData.favorites.slice(0, 3).map((song, index) => (
                          <ListItem key={index} sx={{ px: 0 }}>
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: 'primary.main' }}>
                                <MusicIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={song.title || `Song ${index + 1}`}
                              secondary={song.artist || 'Unknown Artist'}
                            />
                            <ListItemSecondaryAction>
                              <IconButton edge="end">
                                <FavoriteIcon color="error" />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                        No favorite songs yet
                      </Typography>
                    )}
                    <Button fullWidth variant="outlined" sx={{ mt: 2 }}>
                      View All Favorites
                    </Button>
                  </CardContent>
                </Card>
              </motion.div> */}
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Profile;