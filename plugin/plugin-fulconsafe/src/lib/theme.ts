import { createTheme } from '@mui/material/styles'

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
      info: {
        main: '#2196f3',
      },
      warning: {
        main: '#ff9800',
      },
      error: {
        main: '#f44336',
      },
      success: {
        main: '#4caf50', // green for success
      },
      // grey: {
      //   50: '#f7f7f7',
      //   100: '#e7e7e7',
      //   200: '#d7d7d7',
      //   300: '#c7c7c7',
      //   400: '#b7b7b7',
      //   500: '#a7a7a7',
      //   600: '#969696',
      //   700: '#808080',
      //   800: '#666666',
      //   900: '#444444',
      // },
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
      info: {
        main: '#2196f3', // blue for info
      },
      warning: {
        main: '#f7c744', // yellow for warning
      },
      error: {
        main: '#f44336', // red for error
      },
      success: {
        main: '#4caf50', // green for success
      },
      text: {
        primary: '#000000', // black text for good contrast
        secondary: '#555555', // dark grey for secondary text
      },
      grey: {
        50: '#f7f7f7',
        100: '#e7e7e7',
        200: '#d7d7d7',
        300: '#c7c7c7',
        400: '#b7b7b7',
        500: '#a7a7a7',
        600: '#969696',
        700: '#808080',
        800: '#666666',
        900: '#444444',
      },
    },
    typography: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: 14,
    },
});

export {lightTheme, darkTheme};