// src/components/Carousel.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { alpha } from '@mui/material/styles';

// MUI Icons
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import MovieCard from '../components/MovieCard'; // Assuming your MUI MovieCard is ready
// import { Movie } from '../types'; // Assuming Movie type definition

// interface CarouselProps {
//   title: string;
//   movies: Movie[];
//   cardSize?: 'small' | 'medium' | 'large';
// }

const Carousel = ({ title, movies, cardSize = 'medium' }) => {
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const imdbYellow = '#F5C518';
  const arrowButtonBg = '#1F1F1F'; // From your example
  const arrowButtonDisabledBg = '#1F1F1F'; // Can be same or slightly different
  const arrowButtonDisabledColor = 'grey.600'; // MUI theme color
  const darkBgFade = '#121212'; // For the side fade

  const checkScrollability = useCallback(() => {
    const container = containerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth -1); // -1 for precision
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    checkScrollability(); // Initial check

    if (container) {
      container.addEventListener('scroll', checkScrollability);
      window.addEventListener('resize', checkScrollability); // Re-check on resize

      // Check initial scrollability after movies are loaded and rendered
      const timeoutId = setTimeout(checkScrollability, 100); // Small delay for layout to settle

      return () => {
        container.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
        clearTimeout(timeoutId);
      };
    }
  }, [movies, checkScrollability]);


  const scroll = (direction) => {
    const container = containerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.75; // Scroll 75% of visible width
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!movies || movies.length === 0) {
    return null; // Don't render if no movies
  }

  return (
  
    <Box sx={{ position: 'relative', mb: { xs: 3, sm: 4 } /* mb-8 */ }}>
      {/* Title and Desktop Navigation Arrows */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'semibold', color: 'text.primary' }}>
          {title}
        </Typography>

        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 /* space-x-2 */ }}>
          <IconButton
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            size="small"
            sx={{
              bgcolor: !canScrollLeft ? alpha(arrowButtonDisabledBg, 0.5) : arrowButtonBg,
              color: !canScrollLeft ? arrowButtonDisabledColor : 'white',
              borderRadius: '50%',
              p: 0.5, // p-1
              transition: (theme) => theme.transitions.create(['background-color', 'color']),
              '&:hover:not(:disabled)': {
                bgcolor: imdbYellow,
                color: 'black',
              },
              '&.Mui-disabled': {
                cursor: 'not-allowed',
                // MUI handles disabled opacity, but we can be more specific
                bgcolor: alpha(arrowButtonDisabledBg, 0.5),
                color: arrowButtonDisabledColor,
              },
            }}
          >
            <ChevronLeftIcon fontSize="medium" /> {/* size 20 */}
          </IconButton>
          <IconButton
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            size="small"
            sx={{
              bgcolor: !canScrollRight ? alpha(arrowButtonDisabledBg, 0.5) : arrowButtonBg,
              color: !canScrollRight ? arrowButtonDisabledColor : 'white',
              borderRadius: '50%',
              p: 0.5,
              transition: (theme) => theme.transitions.create(['background-color', 'color']),
              '&:hover:not(:disabled)': {
                bgcolor: imdbYellow,
                color: 'black',
              },
              '&.Mui-disabled': {
                cursor: 'not-allowed',
                bgcolor: alpha(arrowButtonDisabledBg, 0.5),
                color: arrowButtonDisabledColor,
              },
            }}
          >
            <ChevronRightIcon fontSize="medium" />
          </IconButton>
        </Box>
      </Box>

      {/* Scrollable Movie Cards Container */}
      <Box sx={{ position: 'relative' }}>
        <Box
          ref={containerRef}
          sx={{
            display: 'flex',
            overflowX: 'auto',
            py: 1, // pb-4 (adjust as needed with card margins)
            gap: { xs: 1.5, sm: 2 }, // space-x-4 (MUI spacing is 8px units)
            scrollBehavior: 'smooth',
            // Scrollbar hiding (might need browser-specific prefixes for full coverage)
            '&::-webkit-scrollbar': {
              display: 'none', // For Chrome, Safari, Edge
            },
            msOverflowStyle: 'none',  // For IE 10+
            scrollbarWidth: 'none',  // For Firefox
            // For scroll snapping (basic attempt, might need more for perfect snap)
            // scrollSnapType: 'x mandatory', // snap-x
          }}
        >
          {movies.map((movie, index) => (
            <Box
              key={movie.id || `movie-${index}`} // Ensure unique key
              // sx={{ scrollSnapAlign: 'start' }} // snap-start
            >
              <MovieCard movie={movie} size={cardSize} />
            </Box>
          ))}
        </Box>

        {/* Mobile Side Fade - only show if scrollable to the right */}
        {canScrollRight && (
            <Box
            sx={{
                display: { xs: 'block', sm: 'none' }, // Only on mobile
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: '48px', // w-12
                backgroundImage: (theme) => `linear-gradient(to left, ${theme.palette.background.default}, transparent)`,
                // backgroundImage: `linear-gradient(to left, ${darkBgFade}, transparent)`, // Use theme color
                pointerEvents: 'none',
                zIndex: 1, // Ensure it's above cards if they have z-index
            }}
            />
        )}
      </Box>
    </Box>
  );
};

export default Carousel;