// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { NavLink as RouterNavLink, useNavigate } from 'react-router-dom';

// MUI Components
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useTheme, alpha, keyframes } from '@mui/material/styles';
import useScrollTrigger from '@mui/material/useScrollTrigger';

// MUI Icons
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MovieOutlinedIcon from '@mui/icons-material/MovieOutlined'; // Icon for Movies link
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import Divider from '@mui/material/Divider'; // <<< ADDED IMPORT

import { useMovieData } from '../context/MovieDataContext';
import { useThemeContext } from '../context/ThemeContext';
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Animations (kept from previous)
const slideInFromLeft = keyframes` /* ... */ `;
const slideInFromRight = keyframes` /* ... */ `;
const textPopIn = keyframes` /* ... */ `;


const Navbar = () => {
  const theme = useTheme();
  const { lastSearch } = useMovieData();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeContext();

  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 10 });

  useEffect(() => {
    if (lastSearch && document.activeElement?.tagName !== 'INPUT') {
      setSearchQuery(lastSearch);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastSearch]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const term = searchQuery.trim();
    if (term) {
      navigate(`/search?query=${encodeURIComponent(term)}`);
      if(mobileOpen) setMobileOpen(false);
    }
  };

  // --- UPDATED navLinks array ---
  const navLinks = [
    { text: 'Home', icon: <HomeOutlinedIcon />, path: '/' },
    { text: 'Movies', icon: <MovieOutlinedIcon />, path: '/movies' }, // <<< NEW "Movies" LINK
    { text: 'Favorites', icon: <FavoriteBorderOutlinedIcon />, path: '/favorites' },
    { text: 'Login', icon: <LoginOutlinedIcon />, path: '/login' },
  ];

  const activeDrawerStyle = {
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
    borderLeft: `3px solid ${theme.palette.primary.main}`,
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'left', width: 260, height: '100%', bgcolor: 'background.paper', pt: 2, display: 'flex', flexDirection: 'column' }} >
      <Box sx={{ px: 2, mb: 2, display: 'flex', alignItems: 'center' }}>
        <LocalMoviesIcon sx={{ mr: 1.5, fontSize: '2.2rem', color: 'primary.main' }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Cine City
        </Typography>
      </Box>
      <List sx={{ flexGrow: 1 }}>
        {navLinks.map((item) => ( // This will now include the "Movies" link
          <ListItem key={item.text} disablePadding sx={{mb: 0.5}}>
            <ListItemButton component={RouterNavLink} to={item.path} end={item.path === '/'} style={({ isActive }) => isActive ? activeDrawerStyle : { color: theme.palette.text.primary, borderLeft: '3px solid transparent' } } sx={{ py: 1.2, px: 2, borderRadius: 1, '&:hover': { bgcolor: alpha(theme.palette.action.hover, 0.06) } }} >
              <ListItemIcon sx={{ minWidth: 'auto', mr: 2, color: 'inherit' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 'inherit', fontSize: '0.95rem' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <ListItem disablePadding>
          <ListItemButton onClick={toggleTheme} sx={{ py: 1.5, px: 2 }}>
              <ListItemIcon sx={{ minWidth: 'auto', mr: 2, color: 'text.secondary' }}>
                  {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </ListItemIcon>
              <ListItemText primary={`Switch to ${mode === 'dark' ? 'Light' : 'Dark'} Mode`} sx={{color: 'text.secondary'}} primaryTypographyProps={{fontSize: '0.9rem'}}/>
          </ListItemButton>
      </ListItem>
    </Box>
  );

  const accentColor = theme.palette.accent?.main || '#F5C518';

  return (
    <>
      <AppBar
        position="sticky"
        elevation={trigger ? 3 : 0}
        sx={{
          bgcolor: trigger ? alpha(theme.palette.background.paper, 0.85) : 'transparent',
          backdropFilter: trigger ? 'blur(10px)' : 'none',
          color: theme.palette.text.primary,
          transition: theme.transitions.create(['background-color', 'backdrop-filter', 'box-shadow', 'color'], {
            duration: theme.transitions.duration.standard,
          }),
          borderBottom: trigger ? 'none' : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: 56, sm: 64 } }}>
          {/* Left Side: Menu Icon and Animated Logo (remains the same) */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            {/* ... MenuIcon ... */}
            {/* ... Animated "Cine City" Title ... */}
            <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: { xs: 0.5, sm: 1.5 }, display: { md: 'none' } }} >
              <MenuIcon />
            </IconButton>
            <RouterNavLink to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
              <LocalMoviesIcon sx={{ mr: 1, fontSize: {xs: '2rem', sm: '2.4rem'}, color: accentColor, animation: `${fadeIn} 0.8s ease-out 0.1s both` }} />
              <Typography variant="h5" noWrap sx={{ display: { xs: 'none', sm: 'flex' }, fontWeight: 700, letterSpacing: '.05rem', fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif', overflow: 'hidden', }} >
                <Box component="span" sx={{ animation: `${textPopIn} 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s both` }}> Cine </Box>
                <Box component="span" sx={{ color: accentColor, animation: `${textPopIn} 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s both`, ml: '5px' }}> City </Box>
              </Typography>
            </RouterNavLink>
          </Box>


          {/* Center: Search Bar (remains the same) */}
          {/* ... Search Bar JSX ... */}
          <Box component="form" onSubmit={handleSearchSubmit} sx={{ /* ... Search Bar styles ... */ }} >
            <IconButton type="submit" sx={{ p: '10px', color: 'text.secondary' }} aria-label="search"> <SearchIcon /> </IconButton>
            <InputBase placeholder="Search Cine City…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} sx={{ color: 'inherit', width: '100%', fontSize: '0.9rem', '& .MuiInputBase-input': { py: '10px', px: 1, } }} />
          </Box>


          {/* Right Side: Desktop Links, Search Icon (Mobile), Theme Toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            {/* --- REFINED DESKTOP NAVIGATION LINKS --- */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', mr: 0.5 }}>
              {navLinks.map((item) => (
                <Button
                  key={item.text}
                  component={RouterNavLink}
                  to={item.path}
                  end={item.path === '/'} // 'end' prop for exact match on Home
                  sx={(theme) => ({ // Pass theme for direct access in sx function
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                    mx: 0.25, // Slightly reduced margin for more links
                    textTransform: 'capitalize',
                    fontSize: '0.9rem', // Slightly smaller to fit more if needed
                    letterSpacing: '0.025em',
                    borderRadius: '16px', // Softer pill shape
                    px: 1.75, // Padding inside button
                    py: 0.75,
                    transition: theme.transitions.create(['color', 'background-color', 'transform'], {
                        duration: theme.transitions.duration.short,
                    }),
                    position: 'relative', // For pseudo-element underline
                    overflow: 'hidden', // For pseudo-element
                    '&::after': { // Subtle underline for active state
                        content: '""',
                        position: 'absolute',
                        bottom: '4px', // Position of underline
                        left: '50%',
                        transform: 'translateX(-50%) scaleX(0)', // Start hidden and centered
                        width: '0%', // Start with no width
                        height: '2px',
                        backgroundColor: theme.palette.primary.main,
                        transition: theme.transitions.create(['width', 'transform'], {
                            duration: theme.transitions.duration.short,
                            easing: theme.transitions.easing.easeInOut,
                        }),
                    },
                    '&:hover': {
                      color: theme.palette.text.primary,
                      bgcolor: alpha(theme.palette.action.hover, 0.08),
                      transform: 'translateY(-1px)', // Slight lift on hover
                    },
                    '&.active': {
                      color: theme.palette.primary.main,
                      fontWeight: '600', // Bolder for active
                      // bgcolor: alpha(theme.palette.primary.main, 0.08), // Optional active background
                      '&::after': { // Animate underline in for active state
                          width: '60%', // Width of underline
                          transform: 'translateX(-50%) scaleX(1)',
                      }
                    }
                  })}
                >
                  {item.text}
                </Button>
              ))}
            </Box>

            {/* Mobile Search Icon - Navigates (remains the same) */}
            {/* ... Mobile Search Icon JSX ... */}
            <IconButton title="Search" color="inherit" sx={{ display: { xs: 'flex', md: 'none' }, ml: 0.5 }} onClick={() => { const term = searchQuery.trim(); navigate(term ? `/search?query=${encodeURIComponent(term)}` : '/search'); }} >
              <SearchIcon />
            </IconButton>


            {/* Theme Toggle (remains the same) */}
            {/* ... Theme Toggle JSX ... */}
            <IconButton title={`Toggle ${mode === 'dark' ? 'light' : 'dark'} mode`} sx={{ ml: { xs: 0.5, sm: 1 } }} onClick={toggleTheme} color="inherit" >
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer (remains the same) */}
      {/* ... Mobile Drawer JSX ... */}
      <Box component="nav">
        <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 260, bgcolor: 'background.paper' }, }} >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default Navbar;