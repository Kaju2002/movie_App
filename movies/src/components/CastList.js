// src/components/CastList.js
import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar'; // Use Avatar for circular images
import { useTheme, alpha } from '@mui/material/styles';
import { getImageUrl } from '../services/tmdbService'; // Ensure path is correct

// Assuming your 'Cast' type from TMDb looks something like this
// interface Cast {
//   id: number;
//   name: string;
//   character: string;
//   profile_path: string | null; // Path to the profile image
//   // Add other fields if needed, like 'order' for sorting
// }

// interface CastListProps {
//   cast: Cast[]; // Expecting an array of cast members
// }

const CastList = ({ cast }) => {
  const theme = useTheme();
  const imdbYellow = '#F5C518'; // Or use theme.palette.secondary.main etc.

  if (!cast || cast.length === 0) {
    // Optionally return null or a message if no cast data is available
    return (
        <Box sx={{ my: 3 }}>
            <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                Cast
            </Typography>
            <Typography color="text.secondary">Cast information not available.</Typography>
        </Box>
    );
  }

  // Limit number of cast members shown if needed (e.g., top 12)
  const displayedCast = cast.slice(0, 12);

  return (
    <Box sx={{ my: { xs: 3, md: 4 } }}> {/* Add vertical margin */}
      <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Top Cast
      </Typography>
      {/* Use MUI Grid for layout */}
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {/* Map over the displayed cast members */}
        {displayedCast.map((person) => (
          // Define grid item sizing for responsiveness
          <Grid item key={person.id} xs={6} sm={4} md={3} lg={2} sx={{ textAlign: 'center' }}>
            <Avatar
              alt={person.name}
              // Get image URL using helper function and profile_path
              src={getImageUrl(person.profile_path, 'w185')} // Use appropriate TMDb image size
              sx={{
                width: { xs: 80, sm: 100, md: 110 }, // Responsive size
                height: { xs: 80, sm: 100, md: 110 },
                margin: '0 auto', // Center avatar
                mb: 1.5, // mb-2 equivalent
                border: `3px solid transparent`, // Start transparent
                transition: theme.transitions.create(['border-color', 'transform'], {
                    duration: theme.transitions.duration.short, // duration-300
                }),
                '&:hover': {
                  borderColor: imdbYellow, // hover:border-[#F5C518]
                  transform: 'scale(1.05)', // hover:scale-105
                },
                // Apply styles to the underlying img tag if needed
                 imgProps: {
                    loading: 'lazy', // Apply lazy loading
                 }
              }}
            />
            <Typography
                variant="body2" // text-sm
                sx={{
                    fontWeight: 500, // font-medium
                    color: 'text.primary', // text-white (adapts to theme)
                    lineHeight: 1.3, // leading-tight
                    mb: 0.5, // Space between name and character
                }}
            >
              {person.name}
            </Typography>
            <Typography
                variant="caption" // text-xs
                sx={{
                    color: 'text.secondary', // text-gray-400 (adapts to theme)
                    display: 'block',
                 }}
            >
              {person.character}
            </Typography>
          </Grid>
        ))}
      </Grid>
      {/* Optional: Add a "See full cast" button/link if you slice the array */}
      {/* {cast.length > displayedCast.length && (
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button component={RouterLink} to={`/movie/${movieId}/cast`}>See Full Cast</Button>
          </Box>
      )} */}
    </Box>
  );
};

export default CastList;