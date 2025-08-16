/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
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
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  IconButton,
  Alert,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Search as SearchIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import SongPlayer from '../components/SongPlayer';

const AllSongs = () => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('title');
  const [filterGenre, setFilterGenre] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(new Set());
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [selectedSong, setSelectedSong] = useState(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  useEffect(() => {
    const loadSongs = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        setApiError('You must be signed in to view songs.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/songs', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        let data = null;
        try {
          data = await response.json();
        } catch {
          data = null;
        }

        if (!response.ok) {
          const message = (data && data.message) ? data.message : `Failed to load songs (${response.status})`;
          throw new Error(message);
        }

        const items = Array.isArray(data) ? data : (data && Array.isArray(data.songs) ? data.songs : []);
        setSongs(items);
      } catch (err) {
        setApiError(err?.message || 'Failed to load songs.');
      } finally {
        setIsLoading(false);
      }
    };

    const loadFavorites = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        return;
      }

      try {
        const response = await fetch('/api/favorites', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Extract song IDs from the favorite song objects
          const favoriteIds = Array.isArray(data) 
            ? data.map(song => song._id) 
            : [];
          setFavorites(new Set(favoriteIds));
        }
      } catch (err) {
        console.error('Failed to load favorites:', err);
        // Don't show error for favorites, just log it
      }
    };

    loadSongs();
    loadFavorites();
  }, []);

  const genres = ['all', 'Pop', 'Pop Rock', 'Hip Hop', 'Indie'];

  const toggleFavorite = async (songId) => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      setApiError('You must be signed in to manage favorites.');
      return;
    }

    try {
      // Check if song is already favorited
      const isCurrentlyFavorited = favorites.has(songId);
      
      if (isCurrentlyFavorited) {
        // Remove from favorites (you might want to add a remove API endpoint later)
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          newFavorites.delete(songId);
          return newFavorites;
        });
      } else {
        // Add to favorites
        const response = await fetch('/api/favorites/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ songId }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.message || `Failed to add song to favorites (${response.status})`);
        }

        // Update local state on successful API call
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          newFavorites.add(songId);
          return newFavorites;
        });
      }
    } catch (err) {
      setApiError(err?.message || 'Failed to update favorites.');
      console.error('Error updating favorites:', err);
    }
  };

  const filteredAndSortedSongs = songs
    .filter(song => {
      const matchesSearch = song.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           song.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           song.album?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = filterGenre === 'all' || song.genre === filterGenre;
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'artist':
          return (a.artist || '').localeCompare(b.artist || '');
        case 'year':
          return (b.releaseYear || 0) - (a.releaseYear || 0);
        default:
          return 0;
      }
    });

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

  const handleSongClick = (song) => {
    // Map the song data to match what SongPlayer expects
    const mappedSong = {
      ...song,
      image: song.imageUrl, // SongPlayer expects 'image' but we have 'imageUrl'
    };
    setSelectedSong(mappedSong);
    setIsPlayerOpen(true);
  };

  const handleClosePlayer = () => {
    setIsPlayerOpen(false);
    setSelectedSong(null);
  };

  const SongCard = ({ song }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        onClick={() => handleSongClick(song)}
        sx={{
          cursor: 'pointer',
          position: 'relative',
          height: '100%',
          '&:hover .play-button': {
            opacity: 1,
            transform: 'translateY(-50%) scale(1)',
          },
        }}
      >
        <CardMedia
          component="img"
          height="200"
          image={song.imageUrl}
          alt={song.title}
        />
        <CardContent>
          <Typography variant="h6" component="h3" gutterBottom noWrap>
            {song.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {song.artist}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {song.album}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
            <Chip label={song.genre} size="small" color="primary" variant="outlined" />
            <Typography variant="caption" color="text.secondary">
              {song.duration}
            </Typography>
          </Box>
        </CardContent>
        <Button
          className="play-button"
          variant="contained"
          onClick={(e) => {
            e.stopPropagation();
            handleSongClick(song);
          }}
          sx={{
            position: 'absolute',
            top: '35%',
            right: 16,
            minWidth: 48,
            width: 48,
            height: 48,
            borderRadius: '50%',
            opacity: 0,
            transform: 'translateY(-50%) scale(0.8)',
            transition: 'all 0.3s ease',
          }}
        >
          <PlayIcon />
        </Button>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(song._id);
          }}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 1)',
            },
          }}
        >
          {favorites.has(song._id) ? (
            <FavoriteIcon color="error" />
          ) : (
            <FavoriteBorderIcon />
          )}
        </IconButton>
      </Card>
    </motion.div>
  );

  const SongListItem = ({ song }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        onClick={() => handleSongClick(song)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          cursor: 'pointer',
          mb: 1,
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <Avatar
          src={song.imageUrl}
          alt={song.title}
          sx={{ width: 56, height: 56, mr: 2 }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="h3">
            {song.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {song.artist} • {song.album} • {song.releaseYear}
          </Typography>
        </Box>
        <Chip label={song.genre} size="small" color="primary" variant="outlined" sx={{ mr: 2 }} />
        <Typography variant="body2" color="text.secondary" sx={{ mr: 2, minWidth: 50 }}>
          {song.duration}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(song._id);
            }}
          >
            {favorites.has(song._id) ? (
              <FavoriteIcon color="error" />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
          <Button
            variant="contained"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleSongClick(song);
            }}
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
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header isAuthenticated={true} />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h3" component="h1" gutterBottom>
                All Songs
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Discover and play from our entire music library
              </Typography>
            </Box>
          </motion.div>

          {/* Filters and Controls */}
          <motion.div variants={itemVariants}>
            <Box sx={{ mb: 4 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    placeholder="Search songs, artists, albums..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={6} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Sort by</InputLabel>
                    <Select
                      value={sortBy}
                      label="Sort by"
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <MenuItem value="title">Title</MenuItem>
                      <MenuItem value="artist">Artist</MenuItem>
                      <MenuItem value="year">Release Year</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Genre</InputLabel>
                    <Select
                      value={filterGenre}
                      label="Genre"
                      onChange={(e) => setFilterGenre(e.target.value)}
                    >
                      {genres.map((genre) => (
                        <MenuItem key={genre} value={genre}>
                          {genre === 'all' ? 'All Genres' : genre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <IconButton
                      onClick={() => setViewMode('grid')}
                      color={viewMode === 'grid' ? 'primary' : 'default'}
                    >
                      <ViewModuleIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => setViewMode('list')}
                      color={viewMode === 'list' ? 'primary' : 'default'}
                    >
                      <ViewListIcon />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </motion.div>

          {apiError && (
            <motion.div variants={itemVariants}>
              <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>
            </motion.div>
          )}

          {/* Results Count */}
          {!isLoading && (
            <motion.div variants={itemVariants}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Showing {filteredAndSortedSongs.length} of {songs.length} songs
              </Typography>
            </motion.div>
          )}

          {isLoading && (
            <motion.div variants={itemVariants}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Loading songs...
              </Typography>
            </motion.div>
          )}

          {/* Songs Display */}
          {!isLoading && (viewMode === 'grid' ? (
            <Grid container spacing={3}>
              {filteredAndSortedSongs.map((song) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={song.id}>
                  <SongCard song={song} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box>
              {filteredAndSortedSongs.map((song) => (
                <SongListItem key={song.id} song={song} />
              ))}
            </Box>
          ))}

          {/* No Results */}
          {!isLoading && filteredAndSortedSongs.length === 0 && (
            <motion.div variants={itemVariants}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h5" gutterBottom>
                  No songs found
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Try adjusting your search or filter criteria
                </Typography>
              </Box>
            </motion.div>
          )}
        </motion.div>
      </Container>

      {/* Song Player */}
      <SongPlayer
        song={selectedSong}
        isOpen={isPlayerOpen}
        onClose={handleClosePlayer}
      />
    </Box>
  );
};

export default AllSongs;