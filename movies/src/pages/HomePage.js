// src/pages/HomePage.js
import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress"; // For overall loading
import Alert from "@mui/material/Alert"; // For errors

import { useMovieData } from "../context/MovieDataContext";
import HeroSlider from "../components/HeroSlider"; 
import Carousel from "../CommonPage/Corousel"; 
// MUI Icons for section titles (replace lucide-react)
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment"; // Flame
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import StarBorderPurple500Icon from "@mui/icons-material/StarBorderPurple500"; // Star
import EventNoteIcon from "@mui/icons-material/EventNote"; // Calendar

const HomePage = () => {
  const {
    featuredMovies,
    trendingMovies,
    popularMovies,
    topRatedMovies,
    newReleases,
    loadingStates,
    error,
  } = useMovieData();

  const imdbYellow = "#F5C518"; // For icon colors

  // Helper to render a section (Icon, Title, Carousel)
  const renderSection = (
    title,
    movies,
    icon,
    isLoading,
    cardSize = "medium"
  ) => {
    if (isLoading && !movies.length) {
      // Show skeleton/loading only if no movies yet
      return (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            {icon}
            <Typography
              variant="h5"
              component="h2"
              sx={{ ml: 1, fontWeight: "semibold" }}
            >
              {title}
            </Typography>
          </Box>
          <Typography>Loading movies...</Typography>{" "}
          {/* Or a Carousel Skeleton */}
        </Box>
      );
    }
    if (!movies || movies.length === 0) return null; // Don't render section if no movies and not loading

    return (
      <Box sx={{ mb: { xs: 4, sm: 5 } }}>
        {" "}
        {/* mb-8 */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: { xs: 2, sm: 3 } /* mb-6 or mb-4 */,
          }}
        >
          {icon}
          <Typography
            variant="h5"
            component="h2"
            sx={{ ml: 1, fontWeight: "semibold" }}
          >
            {title}
          </Typography>
        </Box>
        <Carousel
          title="" // Title is now part of the section header
          movies={movies}
          cardSize={cardSize}
        />
      </Box>
    );
  };

  if (error) {
    return (
      <Container sx={{ py: 5, textAlign: "center" }}>
        <Alert severity="error" sx={{ justifyContent: "center" }}>
          {error}
        </Alert>
      </Container>
    );
  }

  // Check if all initial critical sections are loading
  const isPageLoading = loadingStates.featured && loadingStates.trending; // Example critical sections

  if (isPageLoading && !featuredMovies.length && !trendingMovies.length) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "background.default", color: "text.primary" }}>
      <HeroSlider movies={featuredMovies} isLoading={loadingStates.featured} />

      <Container maxWidth="xl" sx={{ py: { xs: 3, sm: 4 } /* py-6 */ }}>
        {renderSection(
          "Featured Today",
          trendingMovies, // Using trending for "Featured Today" as per your example
          <LocalFireDepartmentIcon
            sx={{
              color: imdbYellow,
              fontSize: { xs: "1.5rem", sm: "1.75rem" } /* size 24 */,
            }}
          />,
          loadingStates.trending,
          "large"
        )}

        {renderSection(
          "Trending",
          popularMovies, // Using "popular" (simulated) for this section
          <TrendingUpIcon
            sx={{
              color: imdbYellow,
              fontSize: { xs: "1.25rem", sm: "1.5rem" } /* size 20 */,
            }}
          />,
          loadingStates.popular
        )}

        {renderSection(
          "Top Rated",
          topRatedMovies,
          <StarBorderPurple500Icon
            sx={{
              color: imdbYellow,
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
            }}
          />,
          loadingStates.topRated
        )}

        {renderSection(
          "New Releases",
          newReleases,
          <EventNoteIcon
            sx={{
              color: imdbYellow,
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
            }}
          />,
          loadingStates.newReleases
        )}
      </Container>
    </Box>
  );
};

export default HomePage;
