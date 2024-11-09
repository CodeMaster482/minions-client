import {createTheme} from '@mui/material/styles'

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#90caf9',
      },
      secondary: {
        main: '#f48fb1',
      },
      background: {
        default: '#121212',
        paper: '#1d1d1d',
      },
    },
    typography: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: 14,
    },
});
  
const lightTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#1976d2', // a vibrant blue suitable for a light theme
      },
      secondary: {
        main: '#dc004e', // a contrasting secondary color, like pink
      },
      background: {
        default: '#ffffff', // white background for light theme
        paper: '#f5f5f5',    // light grey for components like cards
      },
      text: {
        primary: '#000000', // black text for good contrast
        secondary: '#555555', // dark grey for secondary text
      },
    },
    typography: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: 14,
    },
});

export {lightTheme, darkTheme};