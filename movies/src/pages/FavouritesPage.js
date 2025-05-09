// src/pages/FavoritesPage.js
import React, { useState, useMemo } from 'react'; // useMemo for sorting
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
// Removed InputLabel - using variant="standard" or "filled" often doesn't need it explicitly
import Divider from '@mui/material/Divider'; // For visual separation
import { useTheme, alpha } from '@mui/material/styles';

import { useMovieData } from '../context/MovieDataContext'; // Adjust path if needed
import MovieCard from '../components/MovieCard'; // Your MUI MovieCard

// MUI Icons
import FavoriteIcon from '@mui/icons-material/Favorite'; // Use Favorite icon
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'; // Alternative delete icon
import SortIcon from '@mui/icons-material/Sort'; // For sort control indicator
import NavigateNextIcon from '@mui/icons-material/NavigateNext'; // For button

const FavoritesPage = () => {
  const { favorites, toggleFavorite } = useMovieData();
  const theme = useTheme();
  const [sortOption, setSortOption] = useState('date_added'); // Default sort

  const imdbYellow = '#F5C518'; // Keep for potential accents

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  // Memoize sorted favorites to avoid re-sorting on every render unless favorites or sortOption change
  const sortedFavorites = useMemo(() => {
    let sorted = [...favorites];
    // Add actual logic for date_added if you store a timestamp when adding favorites
    // Otherwise, this sort option might just show the current order.
    if (sortOption === 'alphabetical') {
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'rating') {
      return sorted.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    } else if (sortOption === 'release_date') {
      // Ensure release_date is valid before creating Date objects
      return sorted.sort((a, b) => {
        const dateA = a.release_date ? new Date(a.release_date) : new Date(0); // fallback for invalid dates
        const dateB = b.release_date ? new Date(b.release_date) : new Date(0);
        return dateB - dateA; // Newest first
      });
    }
    // Default or 'date_added' (assuming default order is date added descending - newest last)
    // If you store a timestamp, sort by that here.
    return sorted;
  }, [favorites, sortOption]);


  return (
    // Use theme background and text colors
    <Box sx={{ bgcolor: 'background.default', color: 'text.primary', flexGrow: 1, py: { xs: 3, md: 5 } }}>
      <Container maxWidth="xl"> {/* Use xl for wider grid */}
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 3, md: 4 }, px: { xs: 0, sm: 1 } }}>
          <FavoriteIcon sx={{ color: 'primary.main', fontSize: {xs: '2rem', md: '2.5rem'}, mr: 1.5 }} />
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
            Your Favorites
          </Typography>
        </Box>

        {favorites.length > 0 ? (
          <>
            {/* Info and Sort Bar - Combined and styled */}
            <Box
              sx={{
                p: { xs: 1.5, sm: 2 },
                mb: { xs: 3, md: 4 },
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap', // Allow wrapping on small screens
                gap: 2,
                // Use Paper styling without explicit Paper component for more control
                bgcolor: alpha(theme.palette.background.paper, 0.6),
                backdropFilter: 'blur(6px)',
                borderRadius: 2, // Softer edges
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {favorites.length} Item{favorites.length !== 1 ? 's' : ''}
              </Typography>

              {/* Sort Control */}
              <FormControl variant="standard" sx={{ m: 0, minWidth: 150 }}>
                 {/* No InputLabel needed for standard variant here */}
                <Select
                  labelId="sort-favorites-label-simple" // Label is implicit or via aria-label
                  id="sort-favorites-select-simple"
                  value={sortOption}
                  onChange={handleSortChange}
                  disableUnderline // Cleaner look for standard variant
                  IconComponent={SortIcon} // Use sort icon for dropdown indicator
                  sx={{
                      color: 'text.secondary',
                      fontWeight: 500,
                      fontSize: '0.9rem',
                      '.MuiSelect-icon': { // Style the dropdown icon
                        color: 'text.secondary',
                      }
                  }}
                >
                  <MenuItem value="date_added" sx={{ fontSize: '0.9rem' }}>Added</MenuItem>
                  <MenuItem value="alphabetical" sx={{ fontSize: '0.9rem' }}>A-Z</MenuItem>
                  <MenuItem value="rating" sx={{ fontSize: '0.9rem' }}>Rating</MenuItem>
                  <MenuItem value="release_date" sx={{ fontSize: '0.9rem' }}>Release</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Favorites Grid */}
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {sortedFavorites.map((movie) => (
                // Adjust grid columns for better spacing if needed
                <Grid item key={movie.id} xs={6} sm={4} md={3} lg={2.4} xl={2}>
                  {/* Add group class for hover effect */}
                  <Box className="favorite-item-group" sx={{ position: 'relative', '&:hover .remove-button': { opacity: 1, transform: 'scale(1)' } }}>
                    <MovieCard movie={movie} size="medium" />
                    <IconButton
                      className="remove-button" // Target for hover effect
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(movie); }} // Prevent card click
                      aria-label="Remove from favorites"
                      size="small"
                      sx={{
                        position: 'absolute',
                        // Position slightly inset from top-right corner
                        top: { xs: 6, sm: 8 },
                        right: { xs: 6, sm: 8 },
                        bgcolor: alpha(theme.palette.error.main, 0.7), // Semi-transparent red
                        color: theme.palette.error.contrastText, // Usually white
                        opacity: 0, // Hidden by default
                        transform: 'scale(0.8)', // Start slightly smaller
                        transition: theme.transitions.create(['opacity', 'transform', 'background-color'], {
                            duration: theme.transitions.duration.short,
                        }),
                        zIndex: 10,
                        '&:hover': {
                          bgcolor: theme.palette.error.dark, // Darker red on hover
                          transform: 'scale(1.1)', // Enlarge slightly on hover
                        },
                        boxShadow: 2, // Add shadow
                        p: 0.5,
                      }}
                    >
                      {/* Use a different icon? */}
                      <DeleteSweepIcon sx={{ fontSize: '1.1rem' }} />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          // Empty Favorites Message - More engaging design
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              minHeight: '50vh', // Ensure it takes up significant space
              p: 3,
              bgcolor: alpha(theme.palette.background.paper, 0.5),
              borderRadius: 3,
              border: `1px dashed ${theme.palette.divider}`,
            }}
          >
            <FavoriteIcon sx={{ fontSize: 70, color: 'text.disabled', mb: 3 }} />
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 1.5 }}>
              Nothing Here Yet!
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: '500px', mx: 'auto', mb: 4 }}>
              Looks like your favorites list is empty. Start exploring and add movies you love!
            </Typography>
            <Button
              component={RouterLink}
              to="/"
              variant="contained"
              size="large"
              endIcon={<NavigateNextIcon />}
              sx={{
                // bgcolor: 'primary.main', // Use theme primary
                // color: 'primary.contrastText',
                bgcolor: imdbYellow, // Or keep yellow accent
                color: 'black',
                fontWeight: 'bold',
                px: 4,
                py: 1.2,
                borderRadius: '25px', // Pill shape
                '&:hover': {
                  bgcolor: alpha(imdbYellow, 0.85), // Adjust hover color
                  // bgcolor: 'primary.dark', // If using theme primary
                  boxShadow: 3,
                },
              }}
            >
              Explore Movies
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default FavoritesPage;