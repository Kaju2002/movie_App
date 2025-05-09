// src/App.js
import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom'; // Removed unused imports

// MUI Components for layout (instead of Tailwind classes)
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline'; // Ensures consistent baseline

// Your Common Components
import Navbar from './CommonPage/Navbar'; // Assuming path is correct
import Footer from './CommonPage/Footer'; // Assuming path is correct

// Your Page Components
import HomePage from './pages/HomePage';
// Removed MovieDetailsPage import as you use MoviePage
import FavoritesPage from './pages/FavouritesPage'; // Corrected spelling based on your import
import MoviePage from './pages/MoviePage';       // Using this based on your import
import SearchPage from './pages/SearchPage';       // Using this based on your import

// Assuming ThemeProvider is handled globally (e.g., in index.js or a wrapper context)

function App() {
  // Define footer height (adjust based on your Footer's actual height)
  // Check the minHeight of the Toolbar in your Footer.js (e.g., '48px', '64px')
  const footerHeight = '48px';

  return (
   <BrowserRouter>
      {/* Use Box for flex layout and ensure theme background color is applied */}
      <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: 'background.default' // Apply theme background color
        }}
      >
        <CssBaseline /> {/* Apply baseline styles */}
        <Navbar />

        {/* Main content area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1, // Allows this Box to grow and take available space
            // Add padding top/bottom as needed, but importantly padding bottom for fixed footer
            pt: 2, // Example top padding
            pb: `calc(${footerHeight} + ${theme => theme.spacing(2)})`, // Padding bottom = footer height + extra space
            // Example: pb: 10 // if footer is 64px high (8*8) + 16px extra (2*8) = 80px total space
          }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Changed route to use :id based on your MoviePage import */}
            <Route path="/movie/:id" element={<MoviePage />} />
            <Route path="/search" element={<SearchPage />} />
            {/* Ensure path matches FavoritesPage route if needed */}
            <Route path="/favorites" element={<FavoritesPage />} />
            {/* Optional: Add a 404 Not Found Route */}
            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        </Box>

        {/* Render the fixed Footer component */}
        <Footer />
      </Box>
   </BrowserRouter>
  );
}

export default App;