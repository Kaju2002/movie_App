import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
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
import MovieIcon from '@mui/icons-material/Movie';

// Animation
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
            mb: 1.5, // Margin below title
            textAlign: 'center', // Always center section titles for this mobile-focused approach
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
            mb: 0.75, // Reduced margin for tighter mobile stacking
            textDecoration: 'none',
            transition: (theme) => theme.transitions.create('color'),
            '&:hover': {
                color: 'primary.main',
            },
            textAlign: 'center', // Always center links for this mobile-focused approach
        }}
    >
        {children}
    </Link>
);


const Footer = () => {
  const theme = useTheme();
  // This estimation is for App.js pb, footer height is auto
  const estimatedFooterHeightForAppJsPadding = 260; // Increased estimate for mobile stacking

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
  const accentColor = theme.palette.accent?.main || '#F5C518';

  return (
    <AppBar
      position="fixed" // Keeping it fixed as per your setup
      component="footer"
      elevation={0}
      sx={{
        top: 'auto',
        bottom: 0,
        bgcolor: alpha(theme.palette.background.paper, 0.97),
        backdropFilter: 'blur(8px)',
        borderTop: `1px solid ${theme.palette.divider}`,
        color: 'text.primary',
        py: { xs: 2, sm: 3, md: 4 }, // Adjusted vertical padding, less on xs
        animation: `${fadeInSlow} 0.8s ease-out 0.2s both`,
        opacity: 0,
      }}
    >
      <Container maxWidth="lg">
        {/* Main Grid: All items will be xs={12} to stack fully on mobile initially, then adjust for sm+ */}
        <Grid container spacing={{ xs: 2.5, sm: 3 }} justifyContent="center"> {/* Center grid items on xs */}

          {/* Section 1: Branding & Main Message */}
          <Grid item xs={12} sm={6} md={4} sx={{ textAlign: 'center' }}> {/* Center text on all sizes for branding */}
            <Box sx={{ animation: `${fadeInSlow} 0.7s ease-out 0.3s both`, opacity: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
                    <MovieIcon sx={{ color: accentColor, mr: 1, fontSize: {xs: '1.8rem', sm:'2.2rem'} }}/>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        Cine City
                    </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.5, px: {xs: 1, md: 0} }}>
                    Your ultimate destination for discovering movies, exploring cast & crew, and curating your personal watchlist.
                </Typography>
            </Box>
          </Grid>

          {/* Section 2: Discover Links */}
          <Grid item xs={12} sm={3} md={2.5} sx={{ textAlign: 'center' }}> {/* Stack and center */}
            <Box sx={{ animation: `${fadeInSlow} 0.7s ease-out 0.5s both`, opacity: 0 }}>
                <FooterSectionTitle title="Discover" />
                <Box component="nav">
                {discoverLinks.map((link) => (
                    <FooterLink key={link.text} to={link.path}>{link.text}</FooterLink>
                ))}
                </Box>
            </Box>
          </Grid>

          {/* Section 3: Company Links */}
          <Grid item xs={12} sm={3} md={2.5} sx={{ textAlign: 'center' }}> {/* Stack and center */}
             <Box sx={{ animation: `${fadeInSlow} 0.7s ease-out 0.7s both`, opacity: 0 }}>
                <FooterSectionTitle title="Company" />
                <Box component="nav">
                {companyLinks.map((link) => (
                    <FooterLink key={link.text} to={link.path}>{link.text}</FooterLink>
                ))}
                </Box>
            </Box>
          </Grid>

          {/* Section 4: Connect */}
          <Grid item xs={12} md={3} sx={{ textAlign: 'center' }}> {/* Stack and center */}
            <Box sx={{ animation: `${fadeInSlow} 0.7s ease-out 0.9s both`, opacity: 0 }}>
                <FooterSectionTitle title="Connect With Us" />
                <Stack direction="row" spacing={1.5} justifyContent={'center'} sx={{ mb: 1.5 }}>
                {socialLinks.map((link) => (
                    <IconButton
                        key={link.label}
                        aria-label={link.label}
                        href={link.href}
                        target="_blank"
                        size="medium" // Ensure decent tap target
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
        </Grid>

        {/* Bottom copyright and attribution section */}
        <Divider sx={{ my: {xs: 2, sm: 2.5}, borderColor: alpha(theme.palette.divider, 0.3), animation: `${fadeInSlow} 0.7s ease-out 1.1s both`, opacity: 0 }} />
        <Box sx={{ textAlign: 'center', animation: `${fadeInSlow} 0.7s ease-out 1.3s both`, opacity: 0}}>
            <Typography variant="caption" display="block" sx={{ color: 'text.disabled', mb: 0.5 }}>
                <CopyrightIcon sx={{ fontSize: '0.8rem', verticalAlign: 'text-bottom', mr: 0.5 }} />
                {new Date().getFullYear()} Cine City by LoonsLab.
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', color: 'text.disabled'}}>
            Movie data sourced from <Link color="inherit" href="https://www.themoviedb.org/" target="_blank" rel="noopener" sx={{fontWeight: 'medium'}}>TMDb</Link>. Demo project.
            </Typography>
        </Box>
      </Container>
    </AppBar>
  );
};

export default Footer;