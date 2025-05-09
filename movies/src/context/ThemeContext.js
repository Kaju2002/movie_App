// src/context/ThemeContext.js
import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';

// Import your theme definitions
import { lightTheme, darkTheme } from '../styles/theme'; // Adjust path if themes are elsewhere

// Create the context
const ThemeContext = createContext({
  mode: 'light', // Default value
  toggleTheme: () => {}, // Placeholder function
});

// Custom hook to use the theme context
export const useThemeContext = () => useContext(ThemeContext);

// The provider component
export const CustomThemeProvider = ({ children }) => {
  // Check user's system preference
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // Read saved preference from localStorage, fallback to system preference, then default to 'light'
  const getInitialMode = () => {
    try {
      const savedMode = window.localStorage.getItem('appThemeMode');
      return savedMode || (prefersDarkMode ? 'dark' : 'light');
    } catch (e) {
      // Handle potential localStorage access errors (e.g., in private browsing)
      console.error("Could not access localStorage for theme mode:", e);
      return prefersDarkMode ? 'dark' : 'light';
    }
  };

  const [mode, setMode] = useState(getInitialMode);

  // Save preference to localStorage whenever mode changes
  useEffect(() => {
    try {
        window.localStorage.setItem('appThemeMode', mode);
    } catch (e) {
        console.error("Could not save theme mode to localStorage:", e);
    }
  }, [mode]);

  // Memoize the toggle function for performance
  const toggleTheme = useMemo(
    () => () => {
      setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    },
    [] // No dependencies needed for this toggle logic
  );

  // Memoize the theme object based on the current mode
  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

  // Memoize the context value
  const contextValue = useMemo(() => ({ mode, toggleTheme }), [mode, toggleTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {/* Use MUI's ThemeProvider, passing the dynamically selected theme */}
      <MuiThemeProvider theme={theme}>
        {/* CssBaseline applies base styles and background color based on the theme */}
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};