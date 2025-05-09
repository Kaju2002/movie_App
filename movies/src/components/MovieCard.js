// src/components/MovieCard.js
import React from "react"; // Removed useState if only Snackbar uses it
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { useTheme, alpha } from "@mui/material/styles"; // useTheme is still useful for transitions, alpha
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

// MUI Icons
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded"; // Filled star
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined"; // Add to watchlist
import BookmarkAddedRoundedIcon from "@mui/icons-material/BookmarkAddedRounded"; // In watchlist

import { useMovieData } from "../context/MovieDataContext"; // For watchlist/favorites
import { getImageUrl } from "../services/tmdbService"; // To construct image URLs

// --- CLERK IMPORT ---
import { useUser } from "@clerk/clerk-react";

const MovieCard = ({ movie, size = "medium" }) => {
  const theme = useTheme(); // Keep for transitions or if other parts use theme
  const { toggleFavorite, isFavorite } = useMovieData();

  // --- CLERK HOOK ---
  const { isSignedIn } = useUser();

  // --- State for Login Prompt Snackbar ---
  const [loginPromptOpen, setLoginPromptOpen] = React.useState(false);

  // Ensure movie and movie.id are valid before calling isFavorite
  const isFavoritedCurrent = movie && typeof movie.id !== 'undefined' ? isFavorite(movie.id) : false;

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn) {
      setLoginPromptOpen(true);
      return;
    }

    if (movie && typeof movie.id !== 'undefined') {
        toggleFavorite(movie);
    } else {
        console.error("MovieCard: Movie data or ID is missing, cannot toggle favorite.");
    }
  };

  const handleCloseLoginPrompt = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setLoginPromptOpen(false);
  };

  // Return null or a placeholder if essential movie data is missing
  if (!movie || typeof movie.id === 'undefined' || !movie.title) {
    // console.warn("MovieCard received incomplete movie data:", movie);
    return null;
  }

  const posterPath = getImageUrl(movie.poster_path, "w342");
  const year = movie.release_date ? movie.release_date.substring(0, 4) : "N/A";
  const title = movie.title;

  const sizeStyles = {
    small: { width: 128 },
    medium: { width: { xs: 160, sm: 176 } },
    large: { width: { xs: "100%", sm: 240 } },
  };

  const imdbYellow = "#F5C518"; // Kept your specific yellow

  return (
    <> {/* Fragment for Snackbar */}
      <Box
        className="movie-card-group"
        sx={{
          position: "relative",
          ...sizeStyles[size],
          transition: (theme) => // Use theme from useTheme()
            theme.transitions.create("transform", {
              duration: theme.transitions.duration.standard,
            }),
          "&:hover": {
            transform: "translateY(-4px)",
            "& .movie-card-overlay": { opacity: 1, },
            "& .movie-card-bookmark-button": { opacity: 1, }, // Ensure this works with the new opacity rule below
            "& .movie-card-title": { color: imdbYellow, }, // Uses your specific yellow
            "& .movie-card-poster-img": { transform: "scale(1.05)", },
          },
        }}
      >
        <RouterLink
          to={`/movie/${movie.id}`}
          style={{ textDecoration: "none", display: "block" }}
        >
          <Box // Poster Container
            sx={{
              position: "relative",
              aspectRatio: "2/3",
              overflow: "hidden",
              borderRadius: "8px",
              boxShadow: 3,
              bgcolor: "grey.800", // Kept your dark placeholder
            }}
          >
            <Box
              component="img"
              className="movie-card-poster-img"
              src={posterPath}
              alt={title}
              loading="lazy"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: 'block',
                transition: (theme) => // Use theme from useTheme()
                  theme.transitions.create("transform", {
                    duration: "500ms",
                  }),
              }}
            />
            {/* Overlay Gradient */}
            <Box
              className="movie-card-overlay"
              sx={{
                position: "absolute",
                inset: 0,
                zIndex: 1, // Ensure overlay is above image for text contrast
                backgroundImage:
                  "linear-gradient(to top, rgba(0,0,0,0.8) 10%, transparent 50%, transparent)", // Adjusted gradient
                opacity: 0, // Default hidden, shown on hover
                transition: (theme) => // Use theme from useTheme()
                  theme.transitions.create("opacity", {
                    duration: theme.transitions.duration.standard,
                  }),
              }}
            />

            {/* Rating */}
            {typeof movie.vote_average === 'number' && movie.vote_average > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: "8px",
                  left: "8px",
                  zIndex: 2, // Above overlay
                  display: "flex",
                  alignItems: "center",
                  bgcolor: alpha("#000000", 0.75), // Slightly more opaque for readability
                  borderRadius: "4px",
                  px: 0.75,
                  py: 0.35, // Slightly more padding
                }}
              >
                <StarRateRoundedIcon
                  sx={{ color: imdbYellow, fontSize: "0.9rem", mr: 0.5 }}
                />
                <Typography
                  variant="caption"
                  sx={{ color: "white", fontWeight: "medium", lineHeight: "1" }}
                >
                  {movie.vote_average.toFixed(1)}
                </Typography>
              </Box>
            )}

            {/* Watchlist/Favorite Button */}
            <IconButton
              className="movie-card-bookmark-button"
              onClick={handleFavoriteClick} // Logic to check login is here
              aria-label={
                isFavoritedCurrent ? "Remove from favorites" : "Add to favorites"
              }
              size="small"
              sx={{
                position: "absolute",
                top: "8px",
                right: "8px",
                zIndex: 2, // Above overlay
                bgcolor: alpha("#000000", 0.7),
                opacity: { xs: 1, sm: 0 }, // Kept your original opacity rule
                transition: (theme) => // Use theme from useTheme()
                  theme.transitions.create(
                    ["opacity", "background-color", "color"],
                    { duration: theme.transitions.duration.short, }
                  ),
                color: "white", // Default icon color
                // Change icon color when favorited, and hover colors
                ...(isFavoritedCurrent && { color: imdbYellow }), // Yellow if favorited
                "&:hover": {
                  bgcolor: imdbYellow,
                  color: "black",
                },
              }}
            >
              {isFavoritedCurrent ? (
                <BookmarkAddedRoundedIcon sx={{ fontSize: "1.125rem" }} />
              ) : (
                <BookmarkAddOutlinedIcon sx={{ fontSize: "1.125rem" }} />
              )}
            </IconButton>
          </Box>

          {/* Movie Title & Year */}
          <Box sx={{ mt: 1, px: 0.5 }}>
            <Typography
              className="movie-card-title"
              variant="body2"
              component="h3"
              fontWeight="medium"
              title={title}
              sx={{
                color: theme.palette.text.primary, // Theme aware text
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                transition: (theme) => theme.transitions.create("color"), // Use theme from useTheme()
                mb: 0.25,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: theme.palette.text.secondary /* Theme aware text */ }}
            >
              {year}
            </Typography>
          </Box>
        </RouterLink>
      </Box>

      {/* Snackbar for Login Prompt - Appears at TOP CENTER */}
       <Snackbar
        open={loginPromptOpen}
        autoHideDuration={6000}
        onClose={handleCloseLoginPrompt}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: {xs: 7, sm: 8} }} // Adjust based on Navbar height
      >
        <Alert
            onClose={handleCloseLoginPrompt}
            severity="error" // <<< CHANGED to "error" for RED background
            sx={{
                width: '100%',
                boxShadow: theme.shadows[6],
                // bgcolor and color will now be handled by severity="error" based on your theme's error palette
            }}
            action={
                <Button
                    // For error severity, contrastText might be white. If button text is hard to see,
                    // you might need to style it explicitly or ensure your theme's error.contrastText is good.
                    color="inherit" // This will try to use contrastText of the error Alert
                    size="small"
                    component={RouterLink}
                    to="/sign-in"
                    onClick={() => setLoginPromptOpen(false)}
                >
                    Login
                </Button>
            }
        >
          Please log in to add movies to your favorites!
        </Alert>
      </Snackbar>
    </>
  );
};

export default MovieCard;