// src/App.js
import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { useTheme } from "@mui/material/styles";
import Container from '@mui/material/Container'; // Import Container

// Your Common Components
import Navbar from "./CommonPage/Navbar";
import Footer from "./CommonPage/Footer";

// Your Page Components
import HomePage from "./pages/HomePage";
import FavoritesPage from "./pages/FavouritesPage";
import MoviePage from "./pages/MoviePage";
import SearchPage from "./pages/SearchPage";
import AllMoviesPage from "./pages/AllMoviesPage";

// Clerk Components
import { SignIn, SignUp, UserProfile } from "@clerk/clerk-react";
import ProtectedRoute from './components/ProtectedRoute'; // Assuming you have this

function App() {
  const theme = useTheme();
  const estimatedFooterHeight = 200; // Adjust as needed

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
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: { xs: 2, sm: 3 },
            pb: `calc(${estimatedFooterHeight}px + ${theme.spacing(4)})`,
            overflowY: "auto",
            // Make this main Box a flex container to center its children (the routed pages)
            // if they don't take up full width/height themselves.
            display: 'flex',
            flexDirection: 'column', // So content within pages stacks normally
            // alignItems: 'center', // This would center horizontally if pages are narrower than container
            // justifyContent: 'center', // This would center vertically if pages are shorter
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
                <Box // Centering wrapper for the Sign In component
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',    // Center horizontally
                    justifyContent: 'center', // Center vertically
                    flexGrow: 1,              // Allow it to take available space
                    width: '100%',            // Ensure it can use full width for centering
                    py: 4                     // Add some vertical padding
                  }}
                >
                  <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" afterSignInUrl="/" />
                </Box>
              }
            />
            <Route
              path="/sign-up/*"
              element={
                <Box // Centering wrapper for the Sign Up component
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexGrow: 1,
                    width: '100%',
                    py: 4
                  }}
                >
                  <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" afterSignUpUrl="/" />
                </Box>
              }
            />
            <Route
              path="/user-profile/*"
              element={
                <ProtectedRoute>
                  <Box // Optional centering wrapper for User Profile
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      // justifyContent: 'center', // Usually profile starts at top
                      flexGrow: 1,
                      width: '100%',
                      py: 4
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
            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        </Box>
        <Footer />
      </Box>
    </BrowserRouter>
  );
}

export default App;