// src/App.js
import React from 'react';
import { Routes, Route, BrowserRouter, Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container'; // Keep for overall page structure if needed
import Box from '@mui/material/Box';

// Import page components
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import FavoritesPage from './pages/FavouritesPage';
import Navbar from './CommonPage/Navbar';
import MoviePage from './pages/MoviePage';
import SearchPage from './pages/SearchPage';
import Footer from './CommonPage/Footer';

function App() {
  // The state related to trending movies has been moved to HomePage.js
  // App.js now focuses on routing and global layout.

  return (
   <BrowserRouter>
  <div className="flex flex-col min-h-screen bg-[#121212]">
    <Navbar />
    <main className="flex-grow">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MoviePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
      </Routes>
    </main>
    <Footer />
  </div>
</BrowserRouter>
  );
}

export default App;