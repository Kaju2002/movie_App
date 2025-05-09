// src/App.js
import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

// MUI Components for layout
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

import Navbar from "./CommonPage/Navbar";
import Footer from "./CommonPage/Footer";
import HomePage from "./pages/HomePage";
import FavoritesPage from "./pages/FavouritesPage";
import MoviePage from "./pages/MoviePage";
import SearchPage from "./pages/SearchPage";
import AllMoviesPage from "./pages/AllMoviesPage";

// Clerk Components
import { SignIn, SignUp, UserProfile } from "@clerk/clerk-react";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <CssBaseline />
        <Navbar />

        {/* Main content area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1, // <<<< This makes the main content expand, pushing footer down
            pt: { xs: 2, sm: 3 }, // Padding top for content below navbar
            pb: { xs: 3, sm: 4 }, // General padding at the bottom of the content, NOT for fixed footer
            overflowY: "auto", // Allows main content itself to scroll if very long
            display: "flex", // To allow centering of Clerk components if they are direct children
            flexDirection: "column",
          }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movies" element={<AllMoviesPage />} />
            <Route path="/movie/:id" element={<MoviePage />} />
            <Route path="/search" element={<SearchPage />} />

            {/* Clerk Authentication Routes - WRAP IN CENTERING BOX */}
            <Route
              path="/sign-in/*"
              element={
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    flexGrow: 1,
                    width: "100%",
                    py: 4,
                  }}
                >
                  <SignIn
                    routing="path"
                    path="/sign-in"
                    signUpUrl="/sign-up"
                    afterSignInUrl="/"
                  />
                </Box>
              }
            />
            <Route
              path="/sign-up/*"
              element={
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    flexGrow: 1,
                    width: "100%",
                    py: 4,
                  }}
                >
                  <SignUp
                    routing="path"
                    path="/sign-up"
                    signInUrl="/sign-in"
                    afterSignUpUrl="/"
                  />
                </Box>
              }
            />
            <Route
              path="/user-profile/*"
              element={
                <ProtectedRoute>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      flexGrow: 1,
                      width: "100%",
                      py: 4,
                    }}
                  >
                    <UserProfile path="/user-profile" routing="path" />
                  </Box>
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <FavoritesPage />
                </ProtectedRoute>
              }
            />
           
          </Routes>
        </Box>

       
        <Footer />
      </Box>
    </BrowserRouter>
  );
}

export default App;
