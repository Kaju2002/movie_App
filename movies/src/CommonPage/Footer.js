// src/components/Footer.js
import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link'; // MUI Link for external or internal
import { Link as RouterLink } from 'react-router-dom'; // For internal navigation

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto', // Pushes footer to the bottom
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800], // Adjust for light/dark mode
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body1" align="center" gutterBottom>
          Movie Explorer
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
        >
          {'Copyright © '}
          <Link color="inherit" href="https://loonslab.com/" target="_blank" rel="noopener">
            Your Startup Name (LoonsLab)
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
        <Typography variant="caption" color="text.secondary" align="center" display="block" mt={1}>
            Data provided by <Link href="https://www.themoviedb.org/" target="_blank" rel="noopener">TMDb</Link>.
            This project is for demonstration purposes.
        </Typography>
        {/* Add more links if needed */}
        {/* <Box mt={2} display="flex" justifyContent="center" gap={2}>
          <Link component={RouterLink} to="/privacy" color="text.secondary">Privacy Policy</Link>
          <Link component={RouterLink} to="/terms" color="text.secondary">Terms of Service</Link>
        </Box> */}
      </Container>
    </Box>
  );
};

export default Footer;