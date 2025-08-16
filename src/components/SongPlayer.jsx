import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Slider,
  Avatar,
  Paper,
  Button,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  SkipPrevious as PreviousIcon,
  SkipNext as NextIcon,
  VolumeUp as VolumeIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Shuffle as ShuffleIcon,
  Repeat as RepeatIcon,
  Close as CloseIcon,
  QueueMusic as QueueIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const SongPlayer = ({ song, isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off', 'all', 'one'

  // Convert duration string to seconds for calculation
  const durationInSeconds = song ? 
    parseInt(song.duration.split(':')[0]) * 60 + parseInt(song.duration.split(':')[1]) : 0;

  useEffect(() => {
    let interval;
    if (isPlaying && currentTime < durationInSeconds) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, durationInSeconds]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeChange = (event, newValue) => {
    setCurrentTime(newValue);
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
  };

  const handleRepeatToggle = () => {
    const modes = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
  };

  if (!song) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1300,
            background: 'linear-gradient(135deg, #1DB954 0%, #1ed760 30%, #191414 100%)',
          }}
        >
          <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, flexShrink: 0 }}>
              <Typography variant="h6" color="white" sx={{ opacity: 0.9 }}>
                Now Playing
              </Typography>
              <IconButton onClick={onClose} sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Main Content */}
            <Box sx={{ 
              flexGrow: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center',
              py: 2,
              overflow: 'hidden'
            }}>
              {/* Album Art */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Paper
                  elevation={20}
                  sx={{
                    width: { xs: 280, sm: 350, md: 400 },
                    height: { xs: 280, sm: 350, md: 400 },
                    borderRadius: 4,
                    overflow: 'hidden',
                    mb: 3,
                    position: 'relative',
                    flexShrink: 0,
                  }}
                >
                  <motion.img
                    src={song.image}
                    alt={song.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  />
                  {/* Vinyl effect overlay */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      bgcolor: 'rgba(0, 0, 0, 0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        bgcolor: 'white',
                      }}
                    />
                  </Box>
                </Paper>
              </motion.div>

              {/* Song Info */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                style={{ textAlign: 'center', marginBottom: 24, flexShrink: 0 }}
              >
                <Typography variant="h4" component="h1" color="white" gutterBottom sx={{ fontWeight: 600 }}>
                  {song.title}
                </Typography>
                <Typography variant="h6" color="rgba(255, 255, 255, 0.8)" gutterBottom>
                  {song.artist}
                </Typography>
                <Typography variant="body1" color="rgba(255, 255, 255, 0.6)">
                  {song.album}
                </Typography>
              </motion.div>

              {/* Progress Bar */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                style={{ width: '100%', maxWidth: 600, marginBottom: 20, flexShrink: 0 }}
              >
                <Slider
                  value={currentTime}
                  max={durationInSeconds}
                  onChange={handleTimeChange}
                  sx={{
                    color: 'white',
                    height: 6,
                    '& .MuiSlider-thumb': {
                      width: 16,
                      height: 16,
                      backgroundColor: 'white',
                      '&:hover': {
                        boxShadow: '0 0 0 8px rgba(255, 255, 255, 0.16)',
                      },
                    },
                    '& .MuiSlider-track': {
                      backgroundColor: 'white',
                      border: 'none',
                    },
                    '& .MuiSlider-rail': {
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    },
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption" color="rgba(255, 255, 255, 0.8)">
                    {formatTime(currentTime)}
                  </Typography>
                  <Typography variant="caption" color="rgba(255, 255, 255, 0.8)">
                    {song.duration}
                  </Typography>
                </Box>
              </motion.div>

              {/* Main Controls */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, flexShrink: 0 }}
              >
                <IconButton
                  onClick={() => setIsShuffled(!isShuffled)}
                  sx={{
                    color: isShuffled ? '#1DB954' : 'rgba(255, 255, 255, 0.7)',
                    '&:hover': { color: 'white' },
                  }}
                >
                  <ShuffleIcon />
                </IconButton>

                <IconButton
                  sx={{
                    color: 'white',
                    '&:hover': { transform: 'scale(1.1)' },
                    transition: 'transform 0.2s',
                  }}
                >
                  <PreviousIcon sx={{ fontSize: 32 }} />
                </IconButton>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconButton
                    onClick={handlePlayPause}
                    sx={{
                      bgcolor: 'white',
                      color: '#1DB954',
                      width: 64,
                      height: 64,
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        transform: 'scale(1.05)',
                      },
                      transition: 'all 0.2s',
                    }}
                  >
                    {isPlaying ? <PauseIcon sx={{ fontSize: 32 }} /> : <PlayIcon sx={{ fontSize: 32 }} />}
                  </IconButton>
                </motion.div>

                <IconButton
                  sx={{
                    color: 'white',
                    '&:hover': { transform: 'scale(1.1)' },
                    transition: 'transform 0.2s',
                  }}
                >
                  <NextIcon sx={{ fontSize: 32 }} />
                </IconButton>

                <IconButton
                  onClick={handleRepeatToggle}
                  sx={{
                    color: repeatMode !== 'off' ? '#1DB954' : 'rgba(255, 255, 255, 0.7)',
                    '&:hover': { color: 'white' },
                    position: 'relative',
                  }}
                >
                  <RepeatIcon />
                  {repeatMode === 'one' && (
                    <Typography
                      variant="caption"
                      sx={{
                        position: 'absolute',
                        bottom: -2,
                        right: -2,
                        fontSize: 10,
                        fontWeight: 'bold',
                        color: '#1DB954',
                      }}
                    >
                      1
                    </Typography>
                  )}
                </IconButton>
              </motion.div>

              {/* Secondary Controls */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  width: '100%',
                  maxWidth: 350,
                  justifyContent: 'center',
                  flexShrink: 0,
                  paddingBottom: 16,
                }}
              >
                <IconButton
                  onClick={() => setIsFavorite(!isFavorite)}
                  sx={{
                    color: isFavorite ? '#ff4757' : 'rgba(255, 255, 255, 0.7)',
                    '&:hover': { color: isFavorite ? '#ff3742' : 'white' },
                  }}
                >
                  {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                  <VolumeIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                  <Slider
                    value={volume}
                    onChange={handleVolumeChange}
                    sx={{
                      color: 'white',
                      '& .MuiSlider-thumb': {
                        width: 12,
                        height: 12,
                        backgroundColor: 'white',
                      },
                      '& .MuiSlider-track': {
                        backgroundColor: 'white',
                        border: 'none',
                      },
                      '& .MuiSlider-rail': {
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      },
                    }}
                  />
                </Box>

                <IconButton
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': { color: 'white' },
                  }}
                >
                  <QueueIcon />
                </IconButton>
              </motion.div>
            </Box>
          </Container>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SongPlayer;