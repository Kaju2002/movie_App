// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Your global custom CSS if any
import App from './App';
import reportWebVitals from './reportWebVitals';
// Import MUI components
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { MovieDataProvider } from './context/MovieDataContext';

// Create a default theme instance (we can customize this later)
const theme = createTheme({
  // You can customize palette, typography, etc. here later
  // For now, we'll use the defaults.
  // Example:
  // palette: {
  //   primary: {
  //     main: '#1976d2',
  //   },
  //   secondary: {
  //     main: '#dc004e',
  //   },
  // },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Apply baseline styles */}
      <MovieDataProvider>
      <App />

      </MovieDataProvider>
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();