// src/components/Footer.js
import React from 'react';
import AppBar from '@mui/material/AppBar'; // Use AppBar for positioning
import Toolbar from '@mui/material/Toolbar'; // Optional: Provides standard padding/height
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box'; // Keep Box if needed for structure inside Toolbar/Container
// Remove RouterLink import if not used for internal links
// import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <AppBar
      position="fixed" // <<< Key change: Fixes the AppBar
      component="footer" // Semantic element
      elevation={3} // Optional: Add shadow
      sx={{
        top: 'auto', // <<< Important: Unset top position
        bottom: 0,   // <<< Important: Stick to bottom
        zIndex: (theme) => theme.zIndex.drawer + 1, // Ensure it's above drawers if any (optional)
        // Use theme-aware background colors
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[900], // Darker for dark mode footer
        color: 'text.secondary', // Use secondary text color for contrast
      }}
    >
      {/* You can use Toolbar for standard height/padding or just Container */}
      <Toolbar sx={{ minHeight: '48px' /* Adjust height if needed */ }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          {/* You can simplify the structure inside */}
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            Movie Explorer © {new Date().getFullYear()}
            {' | '}
            <Link color="inherit" href="https://loonslab.com/" target="_blank" rel="noopener">
              LoonsLab
            </Link>
          </Typography>
          <Typography variant="caption" display="block">
            Data provided by <Link color="inherit" href="https://www.themoviedb.org/" target="_blank" rel="noopener">TMDb</Link>.
            For demonstration purposes only.
          </Typography>
          {/* Optional Links - Uncomment and style if needed
          <Box mt={1} display="flex" justifyContent="center" gap={1.5}>
            <Link component={RouterLink} to="/privacy" color="inherit" sx={{ fontSize: 'caption.fontSize' }}>Privacy</Link>
            <Link component={RouterLink} to="/terms" color="inherit" sx={{ fontSize: 'caption.fontSize' }}>Terms</Link>
          </Box>
          */}
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;