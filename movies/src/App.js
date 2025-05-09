// src/App.js
import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

// MUI Components for layout
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { useTheme } from "@mui/material/styles"; // Import useTheme
import { SignIn, SignUp, UserProfile } from "@clerk/clerk-react";
import ProtectedRoute from './components/ProtectedRoute'; // You'll create this

// Your Common Components
import Navbar from "./CommonPage/Navbar";
import Footer from "./CommonPage/Footer";

// Your Page Components
import HomePage from "./pages/HomePage";
import FavoritesPage from "./pages/FavouritesPage";
import MoviePage from "./pages/MoviePage";
import SearchPage from "./pages/SearchPage";
import AllMoviesPage from "./pages/AllMoviesPage";

// Main App component
function App() {
  const theme = useTheme(); // Access the theme object here

  // --- DEFINE YOUR FOOTER'S ESTIMATED HEIGHT ---
  // **TEST AND ADJUST THIS VALUE BASED ON YOUR ACTUAL FOOTER'S RENDERED HEIGHT.**
  // For the content-rich footer, this might be around 180px to 220px or more.
  const estimatedFooterHeight = 200; // pixels - EXAMPLE, PLEASE ADJUST!

  return (
    <BrowserRouter>
      <Box sx={{ /* ... */ }}>
        <CssBaseline />
        <Navbar />
        <Box component="main" sx={{ /* ... */ }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movies" element={<AllMoviesPage />} />
            <Route path="/movie/:id" element={<MoviePage />} />
            <Route path="/search" element={<SearchPage />} />

            {/* Clerk Authentication Routes */}
            <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
            <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />
            <Route path="/user-profile/*" element={
              <ProtectedRoute> {/* Protect this route */}
                <UserProfile path="/user-profile" routing="path" />
              </ProtectedRoute>
            } />

            {/* Protected Favorites Route */}
            <Route path="/favorites" element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            } />
            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        </Box>
        <Footer />
      </Box>
    </BrowserRouter>
  );
}

export default App;
