// src/CommonPage/Footer.js
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { useTheme, alpha, keyframes } from '@mui/material/styles';

// MUI Icons
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import CopyrightIcon from '@mui/icons-material/Copyright';
import MovieIcon from '@mui/icons-material/Movie'; // Or your preferred Cine City icon

// Animation (Optional - can be removed if you don't want animations on a standard footer)
const fadeInSlow = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Helper for Section Title with responsive margin
const FooterSectionTitle = ({ title }) => (
    <Typography
        variant="overline"
        gutterBottom
        sx={{
            color: 'text.primary',
            fontWeight: 'bold',
            letterSpacing: '0.05em',
            display: 'block',
            mb: 1.5,
            textAlign: { xs: 'center', sm: 'left' }, // Center on XS, left on SM+
        }}
    >
        {title}
    </Typography>
);

const FooterLink = ({ to, children }) => (
    <Link
        component={RouterLink}
        to={to}
        variant="body2"
        display="block"
        color="text.secondary"
        sx={{
            mb: 1,
            textDecoration: 'none',
            transition: (theme) => theme.transitions.create('color'),
            '&:hover': {
                color: 'primary.main',
            },
            textAlign: { xs: 'center', sm: 'left' },
        }}
    >
        {children}
    </Link>
);


const Footer = () => {
  const theme = useTheme();
  const accentColor = theme.palette.accent?.main || '#F5C518';

  const discoverLinks = [
    { text: 'Popular', path: '/popular' },
    { text: 'Top Rated', path: '/top-rated' },
    { text: 'Upcoming', path: '/upcoming' },
  ];
  const companyLinks = [
    { text: 'About Cine City', path: '/about' },
    { text: 'Contact Us', path: '/contact' },
    { text: 'Privacy Policy', path: '/privacy' },
  ];
  const socialLinks = [
    { label: 'GitHub', icon: <GitHubIcon fontSize="small"/>, href: '#' },
    { label: 'LinkedIn', icon: <LinkedInIcon fontSize="small"/>, href: '#' },
    { label: 'Twitter', icon: <TwitterIcon fontSize="small"/>, href: '#' },
  ];

  return (
    <Box // Changed from AppBar
      component="footer"
      sx={{
        // No fixed positioning here. It's part of the normal document flow.
        bgcolor: 'background.paper', // Use paper for a distinct background
        borderTop: `1px solid ${theme.palette.divider}`,
        color: 'text.secondary', // Default text color for softer look
        py: { xs: 3, sm: 4, md: 5 }, // Generous vertical padding
       
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 3, sm: 3, md: 4 }} justifyContent="space-between" alignItems="flex-start">

          {/* Section 1: Branding & Main Message */}
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'center', md: 'left' }, mb: { xs: 2, md: 0 } }}>
            <Box sx={{ animation: `${fadeInSlow} 0.7s ease-out 0.2s both`, opacity: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: {xs: 'center', md: 'flex-start'}, mb: 1.5 }}>
                    <MovieIcon sx={{ color: accentColor, mr: 1.5, fontSize: {xs: '1.8rem', sm:'2.2rem'} }}/>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        Cine City
                    </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6, px: {xs: 1, md: 0} }}>
                    Your ultimate destination for discovering movies, exploring cast & crew, and curating your personal watchlist.
                </Typography>
            </Box>
          </Grid>

          {/* Section 2 & 3 Wrapper for better mobile stacking and alignment */}
          <Grid item xs={12} sm={6} md={4}>
            <Grid container spacing={{ xs: 3, sm: 2 }}> {/* Inner grid for Discover and Company */}
                <Grid item xs={6}> {/* Discover Links */}
                    <Box sx={{ animation: `${fadeInSlow} 0.7s ease-out 0.4s both`, opacity: 0 }}>
                        <FooterSectionTitle title="Discover" />
                        <Box component="nav">
                        {discoverLinks.map((link) => (
                            <FooterLink key={link.text} to={link.path}>{link.text}</FooterLink>
                        ))}
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={6}> {/* Company Links */}
                    <Box sx={{ animation: `${fadeInSlow} 0.7s ease-out 0.6s both`, opacity: 0 }}>
                        <FooterSectionTitle title="Company" />
                        <Box component="nav">
                        {companyLinks.map((link) => (
                            <FooterLink key={link.text} to={link.path}>{link.text}</FooterLink>
                        ))}
                        </Box>
                    </Box>
                </Grid>
            </Grid>
          </Grid>


          {/* Section 4: Connect */}
          <Grid item xs={12} sm={6} md={4} sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
            <Box sx={{ animation: `${fadeInSlow} 0.7s ease-out 0.8s both`, opacity: 0 }}>
                <FooterSectionTitle title="Connect With Us" />
                <Stack direction="row" spacing={1.5} justifyContent={{xs: 'center', sm: 'flex-end'}} sx={{ mb: 2 }}>
                {socialLinks.map((link) => (
                    <IconButton
                        key={link.label}
                        aria-label={link.label}
                        href={link.href}
                        target="_blank"
                        size="medium"
                        sx={{
                            color: 'text.secondary',
                            bgcolor: alpha(theme.palette.action.selected, 0.05),
                            borderRadius: '50%', p: 1,
                            transition: theme.transitions.create(['color', 'background-color']),
                            '&:hover': { color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.1) }
                        }}
                    >
                        {link.icon}
                    </IconButton>
                ))}
                </Stack>
            </Box>
          </Grid>
        </Grid> {/* End Main Grid */}

        {/* Bottom copyright and attribution section */}
        <Divider sx={{ my: {xs: 2.5, sm: 3}, borderColor: alpha(theme.palette.divider, 0.5), animation: `${fadeInSlow} 0.7s ease-out 1s both`, opacity: 0 }} />
        <Box sx={{ textAlign: 'center', animation: `${fadeInSlow} 0.7s ease-out 1.2s both`, opacity: 0}}>
            <Typography variant="caption" display="block" sx={{ color: 'text.disabled', mb: 0.5 }}>
                <CopyrightIcon sx={{ fontSize: '0.8rem', verticalAlign: 'text-bottom', mr: 0.5 }} />
                {new Date().getFullYear()} Cine City by kajanthan.
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', color: 'text.disabled', mb: 0.5 }}>
              Explore movies, discover favorites, and enjoy the magic of cinema — all in one place.
            </Typography>
            
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;