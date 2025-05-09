// src/components/HeroSlider.js
import React, { useState, useEffect, useCallback } from "react";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import { useTheme, alpha } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar"; // For showing "No trailer" messages
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress"; // For loading state in button

// MUI Icons
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

// Import API functions and Modal component
import {
  getImageUrl,
  getMovieVideos,
  findTrailerKey,
} from "../services/tmdbService"; // Ensure path is correct
import TrailerModal from "./TrailerModal"; // Import the modal component

const HeroSlider = ({ movies, isLoading }) => {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // --- State for Trailer Modal ---
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  const [currentTrailerKey, setCurrentTrailerKey] = useState(null);
  const [trailerLoading, setTrailerLoading] = useState(false);
  const [trailerError, setTrailerError] = useState(null); // For snackbar error
  // --- End State for Trailer Modal ---

  const imdbYellow = "#F5C518";

  const changeSlide = useCallback(
    (index) => {
      if (index === currentIndex) return;
      setIsTransitioning(true);
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 300);
    },
    [currentIndex]
  );

  const nextSlide = useCallback(() => {
    if (!movies || movies.length === 0) return;
    const newIndex = (currentIndex + 1) % movies.length;
    changeSlide(newIndex);
  }, [currentIndex, movies, changeSlide]);

  const prevSlide = useCallback(() => {
    if (!movies || movies.length === 0) return;
    const newIndex = (currentIndex - 1 + movies.length) % movies.length;
    changeSlide(newIndex);
  }, [currentIndex, movies, changeSlide]);

  useEffect(() => {
    if (isLoading || !movies || movies.length <= 1) return;
    const timer = setTimeout(nextSlide, 6000);
    return () => clearTimeout(timer);
  }, [nextSlide, movies, isLoading]);

  if (isLoading) {
    return (
      <Skeleton
        variant="rectangular"
        animation="wave"
        width="100%"
        height={{ xs: "50vh", sm: "60vh", md: "70vh" }}
      />
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <Box
        sx={{
          height: { xs: "50vh", sm: "60vh", md: "70vh" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "grey.900",
        }}
      >
        <Typography variant="h5" color="text.secondary">
          No featured movies available.
        </Typography>
      </Box>
    );
  }

  const currentMovie = movies[currentIndex];
  const year = currentMovie?.release_date
    ? currentMovie.release_date.substring(0, 4)
    : "N/A";
  const title = currentMovie?.title || "Movie Title";
  const overview = currentMovie?.overview || "No overview available.";
  const voteAverage = currentMovie?.vote_average;
  const movieId = currentMovie?.id;

  // --- Trailer Modal Handlers ---
  const handleOpenTrailerModal = async () => {
    if (!movieId) return;
    setTrailerLoading(true);
    setTrailerError(null);
    setCurrentTrailerKey(null);
    try {
      const videos = await getMovieVideos(movieId); // Fetch videos for the specific movie
      const key = findTrailerKey(videos); // Find the best trailer key
      if (key) {
        setCurrentTrailerKey(key);
        setTrailerModalOpen(true); // Open modal only if key is found
      } else {
        setTrailerError(`No trailer found for ${title}.`); // Set error for Snackbar
      }
    } catch (error) {
      console.error("Error fetching trailer:", error);
      setTrailerError("Could not load trailer."); // Set generic error
    } finally {
      setTrailerLoading(false); // Reset loading state
    }
  };

  const handleCloseTrailerModal = () => {
    setTrailerModalOpen(false);
    // Optional delay to prevent iframe reload flash
    setTimeout(() => setCurrentTrailerKey(null), 300);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setTrailerError(null); // Clear error message
  };
  // --- End Trailer Modal Handlers ---

  return (
    // Use React Fragment to allow Modal and Snackbar as siblings to the main Box
    <>
      <Box
        sx={{
          height: { xs: "50vh", sm: "60vh", md: "70vh" },
          position: "relative",
          overflow: "hidden",
          color: "white",
          bgcolor: "common.black",
        }}
      >
        {/* Background Images with Crossfade */}
        {movies.map((movie, index) => (
          <Box
            key={movie.id || `hero-movie-${index}`}
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${getImageUrl(
                movie.backdrop_path,
                "original"
              )})`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
              opacity: index === currentIndex ? 1 : 0,
              transition: "opacity 0.7s ease-in-out",
              zIndex: 0,
            }}
          />
        ))}

        {/* Gradient Overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 25%, rgba(0,0,0,0.3) 50%, transparent 100%)",
            zIndex: 1,
          }}
        />

        {/* Content Area */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            pt: { xs: 2, sm: 3, md: 4 },
            pb: { xs: 6, sm: 8, md: 10 },
            px: { xs: 2, sm: 3, md: 4 },
            maxWidth: { xs: "100%", sm: "80%", md: "65%", lg: "55%" },
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            fontWeight="bold"
            gutterBottom
            sx={{
              fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" },
              textShadow: "2px 2px 6px rgba(0,0,0,0.8)",
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? "translateY(20px)" : "translateY(0)",
              transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 2,
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? "translateY(20px)" : "translateY(0)",
              transition:
                "opacity 0.3s ease-out 0.1s, transform 0.3s ease-out 0.1s",
            }}
          >
            {voteAverage && voteAverage > 0 && (
              <Box
                sx={{
                  bgcolor: imdbYellow,
                  color: "black",
                  fontWeight: "bold",
                  px: 1,
                  py: 0.25,
                  fontSize: "0.8rem",
                  borderRadius: "4px",
                }}
              >
                IMDb {voteAverage.toFixed(1)}
              </Box>
            )}
            <Typography
              variant="body2"
              sx={{ color: "grey.300", fontSize: "0.9rem" }}
            >
              {year}
            </Typography>
          </Box>

          <Typography
            variant="body1"
            sx={{
              mb: 3,
              display: { xs: "none", sm: "block" },
              maxWidth: "650px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: { sm: 2, md: 3 },
              WebkitBoxOrient: "vertical",
              color: "grey.200",
              fontSize: { sm: "0.9rem", md: "1rem" },
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? "translateY(20px)" : "translateY(0)",
              transition:
                "opacity 0.3s ease-out 0.15s, transform 0.3s ease-out 0.15s",
              lineHeight: 1.5,
            }}
          >
            {overview}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1.5,
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? "translateY(20px)" : "translateY(0)",
              transition:
                "opacity 0.3s ease-out 0.2s, transform 0.3s ease-out 0.2s",
            }}
          >
            <Button
              onClick={handleOpenTrailerModal} // Connect to trailer modal handler
              disabled={trailerLoading || !movieId} // Disable while loading or if no ID
              variant="contained"
              size="large"
              startIcon={
                trailerLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <PlayArrowIcon />
                )
              } // Show spinner when loading
              sx={{
                bgcolor: imdbYellow,
                color: "black",
                fontWeight: "bold",
                px: 3,
                "&:hover": { bgcolor: alpha(imdbYellow, 0.85) },
                "&.Mui-disabled": {
                  // Style disabled button
                  bgcolor: alpha(imdbYellow, 0.5),
                  color: alpha("#000", 0.5),
                },
              }}
            >
              Watch Trailer
            </Button>
            {movieId && (
              <Button
                component={RouterLink}
                to={`/movie/${movieId}`}
                variant="contained"
                size="large"
                startIcon={<InfoOutlinedIcon />}
                sx={{
                  bgcolor: alpha(theme.palette.common.white, 0.15),
                  color: "white",
                  fontWeight: "bold",
                  px: 3,
                  "&:hover": {
                    bgcolor: alpha(theme.palette.common.white, 0.25),
                  },
                }}
              >
                More Info
              </Button>
            )}
          </Box>
        </Box>

        {/* Navigation Arrows (Desktop) */}
        {movies.length > 1 && (
          <>
            <IconButton
              onClick={prevSlide}
              aria-label="Previous slide"
              sx={
                {
                  /* ... styles */
                }
              }
            >
              <ChevronLeftIcon fontSize="large" />
            </IconButton>
            <IconButton
              onClick={nextSlide}
              aria-label="Next slide"
              sx={
                {
                  /* ... styles */
                }
              }
            >
              <ChevronRightIcon fontSize="large" />
            </IconButton>
          </>
        )}

        {/* Dots Navigation */}
        {movies.length > 1 && (
          <Box
            sx={
              {
                /* ... styles */
              }
            }
          >
            {Array.from({ length: Math.min(movies.length, 7) }).map(
              (_, index) => (
                <IconButton
                  key={`hero-dot-${index}`}
                  size="small"
                  onClick={() => changeSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  sx={
                    {
                      /* ... styles */
                    }
                  }
                />
              )
            )}
          </Box>
        )}
      </Box>

      {/* Trailer Modal - Rendered outside the main Box but within the Fragment */}
      <TrailerModal
        open={trailerModalOpen}
        handleClose={handleCloseTrailerModal}
        trailerKey={currentTrailerKey}
        title={title}
      />

      {/* Snackbar for "No Trailer" message */}
      <Snackbar
        open={!!trailerError}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="warning"
          sx={{ width: "100%" }}
        >
          {trailerError}
        </Alert>
      </Snackbar>
    </> // Close React Fragment
  );
};

export default HeroSlider;
