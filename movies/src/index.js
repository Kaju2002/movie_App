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
import { CustomThemeProvider } from './context/ThemeContext';
import { ClerkProvider } from '@clerk/clerk-react'

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


const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl='/'>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Apply baseline styles */}
      <CustomThemeProvider>
      <MovieDataProvider>
      <App />

      </MovieDataProvider>
      </CustomThemeProvider>
    </ThemeProvider>
    </ClerkProvider>
  </React.StrictMode>
);

reportWebVitals();