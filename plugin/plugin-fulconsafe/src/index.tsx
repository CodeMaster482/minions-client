import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, MemoryRouter } from 'react-router-dom'

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { darkTheme, lightTheme } from './lib/theme';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const Main = () => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default theme is dark

  // Function to toggle themes
  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      {/* ThemeProvider makes the theme available down the React tree thanks to React context. */}
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      {/*initialEntries={['/', '/login', '/profile']}*/}
      {/*basename='/'*/}
      <MemoryRouter 
        future={{v7_startTransition: true}}
        basename="/" 
        initialEntries={['/', '/profile', '/login', '/settings']} 
        initialIndex={0}
      >
        <App toggleTheme={toggleTheme} />
      </MemoryRouter>
    </ThemeProvider>
  );
};

root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
