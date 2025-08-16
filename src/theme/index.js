import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1DB954', // Spotify green
      dark: '#1ed760',
      light: '#4caf50',
    },
    secondary: {
      main: '#191414', // Spotify black
      dark: '#000000',
      light: '#424242',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F8F8F8',
    },
    text: {
      primary: '#000000',
      secondary: '#6C6C6C',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#4caf50',
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h1: {
      fontSize: '36px',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '28px',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '24px',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '20px',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '18px',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '16px',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
    caption: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: 1.4,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          padding: '10px 24px',
          fontSize: '14px',
          fontWeight: 600,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(29, 185, 84, 0.3)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
});

export default theme;