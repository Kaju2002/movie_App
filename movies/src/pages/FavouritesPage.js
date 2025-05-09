// src/pages/FavoritesPage.js
import React, { useState } from 'react'; // useState for potential sort later
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper'; // For the info bar
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { useTheme, alpha } from '@mui/material/styles';


import { useMovieData } from '../context/MovieDataContext';
import MovieCard from '../components/MovieCard'; // Your MUI MovieCard

// MUI Icons
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded'; // Similar to BookmarkCheck
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'; // Similar to Trash2

const FavoritesPage = () => {
  const { favorites, toggleFavorite } = useMovieData();
  const theme = useTheme();
  const [sortOption, setSortOption] = useState('date_added'); // Placeholder for sorting

  const imdbYellow = '#F5C518'; // Consistent with your HomePage

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
    // Add sorting logic here if implementing
    // For example, re-fetch or re-sort the 'favorites' array based on the option
  };

  // Sorting logic (simple example, can be expanded)
  const getSortedFavorites = () => {
    let sorted = [...favorites];
    // Assuming 'favorites' from context are added chronologically (newest last)
    // 'date_added' would mean reversing or relying on original order if new items are pushed
    // This is a placeholder; actual sorting would depend on how 'date_added' is tracked
    if (sortOption === 'date_added') {
        // If no explicit date_added timestamp, reverse might show newest first if pushed to end
        // return sorted.reverse();
        return sorted; // Assuming newest are at the end, or handle actual timestamp
    } else if (sortOption === 'alphabetical') {
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'rating') {
      return sorted.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    } else if (sortOption === 'release_date') {
      return sorted.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
    }
    return sorted;
  };

  const sortedFavorites = getSortedFavorites();


  return (
    <Box sx={{ bgcolor: 'background.default', color: 'text.primary', minHeight: 'calc(100vh - 128px)', py: 4 }}> {/* Adjust minHeight based on Navbar/Footer */}
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 3, sm: 4 } }}>
          <BookmarkAddedIcon sx={{ color: imdbYellow, fontSize: {xs: '1.75rem', sm: '2rem'}, mr: 1.5 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Your Favorites
          </Typography>
        </Box>

        {favorites.length > 0 ? (
          <>
            {/* Info and Sort Bar */}
            <Paper
              elevation={2}
              sx={{
                p: 2,
                mb: { xs: 3, sm: 4 },
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: 1,
                bgcolor: (theme) => alpha(theme.palette.background.paper, 0.7), // Slightly transparent
                backdropFilter: 'blur(5px)', // Optional: frosted glass effect
              }}
            >
              <Typography variant="body1" color="text.secondary">
                <Box component="span" fontWeight="bold" color="text.primary">
                  {favorites.length}
                </Box> movie{favorites.length !== 1 ? 's' : ''} in your favorites
              </Typography>

              <FormControl size="small" sx={{ minWidth: 180, display: { xs: 'none', sm: 'block' } }}>
                <InputLabel id="sort-favorites-label">Sort by</InputLabel>
                <Select
                  labelId="sort-favorites-label"
                  id="sort-favorites-select"
                  value={sortOption}
                  label="Sort by"
                  onChange={handleSortChange}
                  sx={{
                    bgcolor: 'background.paper', // Ensure select has solid background
                    '.MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha(theme.palette.text.primary, 0.23),
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha(theme.palette.text.primary, 0.5),
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  <MenuItem value="date_added">Recently Added</MenuItem>
                  <MenuItem value="alphabetical">A-Z</MenuItem>
                  <MenuItem value="rating">Rating (Highest)</MenuItem>
                  <MenuItem value="release_date">Release Date (Newest)</MenuItem>
                </Select>
              </FormControl>
            </Paper>

            {/* Favorites Grid */}
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {sortedFavorites.map((movie) => (
                <Grid item key={movie.id} xs={6} sm={4} md={3} lg={2.4} xl={2}>
                  <Box sx={{ position: 'relative', '&:hover .remove-button': { opacity: 1 } }}>
                    <MovieCard movie={movie} size="medium" />
                    <IconButton
                      className="remove-button"
                      onClick={() => toggleFavorite(movie)}
                      aria-label="Remove from favorites"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: { xs: -4, sm: -6 }, // Adjust for desired overlap
                        right: { xs: -4, sm: -6 },
                        bgcolor: 'error.main', // Red for delete
                        color: 'white',
                        opacity: { xs: 1, sm: 0 }, // Always visible on xs, hover on sm+
                        transition: (theme) => theme.transitions.create('opacity'),
                        zIndex: 10, // Ensure it's above MovieCard's elements
                        '&:hover': {
                          bgcolor: 'error.dark',
                        },
                        boxShadow: 1,
                        p: 0.5, // Smaller padding for a compact button
                      }}
                    >
                      <DeleteOutlineIcon sx={{ fontSize: '1rem' }} /> {/* Smaller icon */}
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          // Empty Watchlist Message
          <Paper
            elevation={2}
            sx={{
              p: { xs: 3, sm: 5 },
              textAlign: 'center',
              bgcolor: (theme) => alpha(theme.palette.background.paper, 0.7),
              backdropFilter: 'blur(5px)',
            }}
          >
            <BookmarkAddedIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'semibold', mb: 1.5 }}>
              Your Favorites List is Empty
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: '450px', mx: 'auto', mb: 3 }}>
              Add movies to your favorites to keep track of what you love to watch.
            </Typography>
            <Button
              component={RouterLink}
              to="/"
              variant="contained"
              size="large"
              sx={{
                bgcolor: imdbYellow,
                color: 'black',
                fontWeight: 'bold',
                '&:hover': {
                  bgcolor: alpha(imdbYellow, 0.85),
                },
              }}
            >
              Browse Popular Movies
            </Button>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default FavoritesPage;