/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Avatar,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Favorite as FavoriteIcon,
  MoreVert as MoreIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import SongPlayer from '../components/SongPlayer';

const Home = () => {
  const [selectedSong, setSelectedSong] = useState(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  // Function to get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Good morning! ☀️';
    } else if (hour < 17) {
      return 'Good afternoon! 🌤️';
    } else if (hour < 21) {
      return 'Good evening! 🌆';
    } else {
      return 'Good night! 🌙';
    }
  };

  // Mock data for demonstration
  const featuredPlaylists = [
    {
      id: 1,
      title: 'Today\'s Top Hits',
      description: 'The most played songs right now',
      image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
      songs: 50,
    },
    {
      id: 2,
      title: 'Chill Vibes',
      description: 'Relax and unwind with these mellow tracks',
      image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300',
      songs: 32,
    },
    {
      id: 3,
      title: 'Workout Mix',
      description: 'High energy songs to fuel your workout',
      image: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=300',
      songs: 28,
    },
    {
      id: 4,
      title: 'Jazz Classics',
      description: 'Timeless jazz standards and modern interpretations',
      image: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=300',
      songs: 45,
    },
  ];

  const recentlyPlayed = [
    {
      id: 1,
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=100',
      duration: '3:20',
    },
    {
      id: 2,
      title: 'Watermelon Sugar',
      artist: 'Harry Styles',
      album: 'Fine Line',
      image: 'https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=100',
      duration: '2:54',
    },
    {
      id: 3,
      title: 'Levitating',
      artist: 'Dua Lipa',
      album: 'Future Nostalgia',
      image: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=100',
      duration: '3:23',
    },
  ];

  const handleSongClick = (song) => {
    setSelectedSong(song);
    setIsPlayerOpen(true);
  };

  const handleClosePlayer = () => {
    setIsPlayerOpen(false);
    setSelectedSong(null);
  };

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

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header isAuthenticated={true} />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Welcome Section */}
          <motion.div variants={itemVariants}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h3" component="h1" gutterBottom>
                {getGreeting()}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Welcome back to your music world
              </Typography>
            </Box>
          </motion.div>

          {/* Featured Playlists */}
          <motion.div variants={itemVariants}>
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TrendingIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h4" component="h2">
                  Featured Playlists
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                {featuredPlaylists.map((playlist) => (
                  <Grid item xs={12} sm={6} md={3} key={playlist.id}>
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card
                        sx={{
                          cursor: 'pointer',
                          position: 'relative',
                          '&:hover .play-button': {
                            opacity: 1,
                            transform: 'translateY(-50%) scale(1)',
                          },
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="200"
                          image={playlist.image}
                          alt={playlist.title}
                        />
                        <CardContent>
                          <Typography variant="h6" component="h3" gutterBottom>
                            {playlist.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {playlist.description}
                          </Typography>
                          <Chip
                            label={`${playlist.songs} songs`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </CardContent>
                        <Button
                          className="play-button"
                          variant="contained"
                          sx={{
                            position: 'absolute',
                            top: '40%',
                            right: 16,
                            minWidth: 48,
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            opacity: 0,
                            transform: 'translateY(-50%) scale(0.8)',
                            transition: 'all 0.3s ease',
                            bgcolor: 'primary.main',
                            '&:hover': {
                              bgcolor: 'primary.dark',
                            },
                          }}
                        >
                          <PlayIcon />
                        </Button>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </motion.div>

          {/* Recently Played */}
          <motion.div variants={itemVariants}>
            <Box>
              <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
                Recently Played
              </Typography>
              
              <Grid container spacing={2}>
                {recentlyPlayed.map((song) => (
                  <Grid item xs={12} key={song.id}>
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          p: 2,
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                        }}
                        onClick={() => handleSongClick(song)}
                      >
                        <Avatar
                          src={song.image}
                          alt={song.title}
                          sx={{ width: 56, height: 56, mr: 2 }}
                        />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" component="h3">
                            {song.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {song.artist} • {song.album}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                          {song.duration}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              minWidth: 40,
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                            }}
                          >
                            <PlayIcon />
                          </Button>
                        </Box>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
      
      <SongPlayer
        song={selectedSong}
        isOpen={isPlayerOpen}
        onClose={handleClosePlayer}
      />
    </Box>
  );
};

export default Home;