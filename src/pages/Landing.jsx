import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  MusicNote as MusicIcon,
  Headphones as HeadphonesIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <MusicIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Millions of Songs',
      description: 'Access to a vast library of music from around the world',
    },
    {
      icon: <HeadphonesIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'High Quality Audio',
      description: 'Crystal clear sound quality for the best listening experience',
    },
    {
      icon: <FavoriteIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Personalized Playlists',
      description: 'Create and customize playlists that match your taste',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header isAuthenticated={false} />
      
      {/* Hero Section */}
      <Container maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Box
            sx={{
              py: 8,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #1DB954 0%, #1ed760 100%)',
              borderRadius: 4,
              mt: 4,
              color: 'white',
            }}
          >
            <motion.div variants={itemVariants}>
              <Typography variant="h1" component="h1" gutterBottom>
                Your Music, Your Way
              </Typography>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Typography variant="h5" component="p" sx={{ mb: 4, opacity: 0.9 }}>
                Stream millions of songs, create playlists, and discover new music
              </Typography>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<PlayIcon />}
                  onClick={() => navigate('/signup')}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'grey.100',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Get Started Free
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Sign In
                </Button>
              </Box>
            </motion.div>
          </Box>

          {/* Features Section */}
          <Box sx={{ py: 8 }}>
            <motion.div variants={itemVariants}>
              <Typography variant="h2" component="h2" textAlign="center" gutterBottom>
                Why Choose MusicStream?
              </Typography>
            </motion.div>

            <Grid container spacing={4} sx={{ mt: 4 }}>
              {features.map((feature, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        textAlign: 'center',
                        p: 3,
                        cursor: 'pointer',
                      }}
                    >
                      <CardContent>
                        <Box sx={{ mb: 2 }}>
                          {feature.icon}
                        </Box>
                        <Typography variant="h5" component="h3" gutterBottom>
                          {feature.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* CTA Section */}
          <motion.div variants={itemVariants}>
            <Box
              sx={{
                py: 6,
                textAlign: 'center',
                bgcolor: 'background.paper',
                borderRadius: 4,
                mb: 4,
              }}
            >
              <Typography variant="h3" component="h2" gutterBottom>
                Ready to Start Listening?
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Join millions of music lovers and start your journey today
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayIcon />}
                onClick={() => navigate('/signup')}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                }}
              >
                Start Listening Now
              </Button>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Landing;