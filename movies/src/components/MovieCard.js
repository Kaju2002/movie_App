// src/components/MovieCard.js
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { alpha } from '@mui/material/styles';

// MUI Icons
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded'; // Filled star
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined'; // Add to watchlist
import BookmarkAddedRoundedIcon from '@mui/icons-material/BookmarkAddedRounded'; // In watchlist

import { useMovieData } from '../context/MovieDataContext'; // For watchlist/favorites
import { getImageUrl } from '../services/tmdbService'; // To construct image URLs

// Define Types (align with your project's Movie type)
// interface Movie {
//   id: number | string;
//   title: string;
//   poster_path?: string;
//   vote_average?: number;
//   release_date?: string; // Or year as string/number
//   // Add other fields if your Movie type has them and they are used by the card
// }

// interface MovieCardProps {
//   movie: Movie;
//   size?: 'small' | 'medium' | 'large'; // Corresponds to your Tailwind w-32, w-40/44, w-full/60
// }

const MovieCard = ({ movie, size = 'medium' }) => {
  const { toggleFavorite, isFavorite } = useMovieData();
  const isFavorited = isFavorite(movie.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    e.stopPropagation(); // Stop event from bubbling up to the Link
    toggleFavorite(movie);
  };

  const posterPath = getImageUrl(movie.poster_path, 'w342'); // Choose an appropriate size
  const year = movie.release_date ? movie.release_date.substring(0, 4) : 'N/A';

  // Define size-based styling
  const sizeStyles = {
    small: { width: 128 }, // w-32 (32 * 4px = 128px)
    medium: { width: { xs: 160, sm: 176 } }, // w-40, sm:w-44
    large: { width: { xs: '100%', sm: 240 } }, // w-full, sm:w-60
  };

  const imdbYellow = '#F5C518';

  return (
    <Box
      className="movie-card-group" // For targeting with sx if needed, like group-hover
      sx={{
        position: 'relative',
        ...sizeStyles[size],
        transition: (theme) => theme.transitions.create('transform', {
          duration: theme.transitions.duration.standard, // 300ms
        }),
        '&:hover': {
          transform: 'translateY(-4px)', // -translate-y-1 (1 * 0.25rem = 4px)
          '& .movie-card-overlay': { // Targeting by className for group-hover effect
            opacity: 1,
          },
          '& .movie-card-bookmark-button': {
            opacity: 1,
          },
          '& .movie-card-title': {
            color: imdbYellow, // Change title color on hover
          },
          '& .movie-card-poster-img': {
              transform: 'scale(1.05)',
          }
        },
      }}
    >
      <RouterLink to={`/movie/${movie.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <Box
          sx={{
            position: 'relative',
            aspectRatio: '2/3',
            overflow: 'hidden',
            borderRadius: '8px', // rounded-md
            boxShadow: 3, // shadow-lg (MUI elevation 3 is a good starting point)
            bgcolor: 'grey.800', // Placeholder background if image fails
          }}
        >
          <Box
            component="img"
            className="movie-card-poster-img"
            src={posterPath}
            alt={movie.title}
            loading="lazy"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: (theme) => theme.transitions.create('transform', {
                duration: '500ms',
              }),
            }}
          />
          {/* Overlay Gradient */}
          <Box
            className="movie-card-overlay"
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent, transparent)',
              opacity: 0,
              transition: (theme) => theme.transitions.create('opacity', {
                duration: theme.transitions.duration.standard, // 300ms
              }),
            }}
          />

          {/* Rating */}
          {movie.vote_average !== undefined && movie.vote_average > 0 && (
            <Box
              sx={{
                position: 'absolute',
                bottom: '8px', // bottom-2
                left: '8px',   // left-2
                display: 'flex',
                alignItems: 'center',
                bgcolor: alpha('#000000', 0.7), // bg-black/70
                borderRadius: '4px', // rounded
                px: 0.75, // px-1.5 (Tailwind px-1.5 is 6px, 0.75 * 8px = 6px)
                py: 0.25, // py-0.5
              }}
            >
              <StarRateRoundedIcon sx={{ color: imdbYellow, fontSize: '0.875rem', mr: 0.5 /* w-3 h-3 mr-1 */}} />
              <Typography variant="caption" sx={{ color: 'white', fontWeight: 'medium', lineHeight: '1' }}>
                {movie.vote_average.toFixed(1)}
              </Typography>
            </Box>
          )}

          {/* Watchlist/Favorite Button */}
          <IconButton
            className="movie-card-bookmark-button"
            onClick={handleFavoriteClick}
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            size="small"
            sx={{
              position: 'absolute',
              top: '8px', // top-2
              right: '8px', // right-2
              bgcolor: alpha('#000000', 0.7), // bg-black/70
              opacity: 0, // Hidden by default, shown on parent hover
              transition: (theme) => theme.transitions.create(['opacity', 'background-color', 'color'], {
                 duration: theme.transitions.duration.short, // Faster transition for button
              }),
              color: 'white',
              '&:hover': {
                bgcolor: imdbYellow,
                color: 'black',
              },
            }}
          >
            {isFavorited ? (
              <BookmarkAddedRoundedIcon sx={{ fontSize: '1.125rem' /* w-4 h-4 */}} />
            ) : (
              <BookmarkAddOutlinedIcon sx={{ fontSize: '1.125rem' }} />
            )}
          </IconButton>
        </Box>

        {/* Movie Title & Year */}
        <Box sx={{ mt: 1 /* mt-2 (MUI theme.spacing(1) = 8px) */ }}>
          <Typography
            className="movie-card-title"
            variant="body2" // Similar to text-sm
            component="h3"
            fontWeight="medium"
            sx={{
              color: 'text.primary', // Will adapt to light/dark mode
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap', // For line-clamp-1 effect
              transition: (theme) => theme.transitions.create('color'),
            }}
          >
            {movie.title}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' /* text-gray-400 text-xs */ }}>
            {year}
          </Typography>
        </Box>
      </RouterLink>
    </Box>
  );
};

export default MovieCard;