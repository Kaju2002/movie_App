// src/styles/theme.js (or place inside ThemeContext.js)
import { createTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles"; // Import alpha for transparency

// Define common palette colors or overrides if needed
const primaryColor = "#90caf9"; // Example: Light blue for primary accents
const secondaryColor = "#f48fb1"; // Example: Light pink
const imdbYellow = "#F5C518"; // Accent

// Define basic typography, spacing, etc. - can be shared or overridden
const baseThemeOptions = {
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    // Define h1, h2, etc. sizes if desired
  },
  shape: {
    borderRadius: 8, // Slightly softer corners than default 4
  },
 
};

// --- Light Theme ---
export const lightTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: "light",
    primary: {
      main: primaryColor, 
    },
    secondary: {
      main: secondaryColor,
    },
    background: {
      default: "#f4f6f8", // A very light grey
      paper: "#ffffff",
    },
    text: {
      primary: "#212121", // Dark grey
      secondary: "#616161", // Medium grey
    },
    // Custom accents if needed
    accent: {
      main: imdbYellow,
      contrastText: "#000",
    },
    // Example subtle background for elements
    subtleBackground: alpha("#000000", 0.04),
  },
});

// --- Dark Theme ---
export const darkTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: "dark",
    primary: {
      main: primaryColor, // Use the same light blue
    },
    secondary: {
      main: secondaryColor,
    },
    background: {
      default: "#121212", // Standard dark
      paper: "#1e1e1e", // Slightly lighter dark for surfaces
    },
    text: {
      primary: "#e0e0e0", // Light grey
      secondary: "#b0b0b0", // Medium grey
    },
    // Custom accents if needed
    accent: {
      main: imdbYellow,
      contrastText: "#000",
    },
    // Example subtle background for elements
    subtleBackground: alpha("#ffffff", 0.08),
  },
});
