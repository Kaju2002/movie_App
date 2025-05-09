// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { NavLink as RouterNavLink, useNavigate } from 'react-router-dom'; // Use NavLink for active styling

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
import { useTheme, alpha } from '@mui/material/styles'; // Import useTheme
import useScrollTrigger from '@mui/material/useScrollTrigger'; // To detect scroll

// MUI Icons
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import TheatersIcon from '@mui/icons-material/Theaters';

// Import useMovieData to get lastSearch (Adjust path if necessary)
import { useMovieData } from '../context/MovieDataContext';

// Placeholder for actual Theme Context Hook
// Replace this with your actual theme context import and usage
const useThemeContext = () => {
    const [mode, setMode] = useState('dark'); // Default to dark for placeholder
    const toggleTheme = () => setMode(prev => prev === 'light' ? 'dark' : 'light');
    // In a real app, this context would provide the mode and toggle function
    // from a ThemeProvider higher up in the component tree.
    return { mode, toggleTheme };
};


const Navbar = () => {
  const theme = useTheme(); // Get theme object
  const { lastSearch } = useMovieData(); // Get lastSearch from context
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  // Use placeholder context for now - REPLACE WITH YOUR ACTUAL THEME CONTEXT
  const { mode, toggleTheme } = useThemeContext();

  // Detect scroll to change AppBar appearance
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 10,
  });

  // Initialize searchQuery from lastSearch in localStorage (via context)
  useEffect(() => {
    // Only update if the input isn't currently focused by the user
    // to avoid overwriting while they might be typing after a page load.
    if (lastSearch && document.activeElement?.tagName !== 'INPUT') {
      setSearchQuery(lastSearch);
    }
  // Only run this effect when lastSearch changes from the context
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastSearch]);


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const term = searchQuery.trim();
    if (term) {
      navigate(`/search?query=${encodeURIComponent(term)}`);
      // Keep searchQuery in the bar after submitting for context,
      // SearchResultsPage will handle clearing if needed or updating context
      if(mobileOpen) setMobileOpen(false);
    }
  };

  const navLinks = [
    { text: 'Home', icon: <HomeOutlinedIcon />, path: '/' },
    { text: 'Favorites', icon: <FavoriteBorderOutlinedIcon />, path: '/favorites' },
    { text: 'Login', icon: <LoginOutlinedIcon />, path: '/login' },
  ];

  // Active NavLink Style for Drawer (can be different from desktop if needed)
  const activeDrawerStyle = {
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    // You might want a background highlight instead/as well
    // backgroundColor: alpha(theme.palette.primary.main, 0.1),
  };

  const drawer = (
    <Box
      onClick={handleDrawerToggle} // Close drawer on item click or background click
      sx={{ textAlign: 'left', width: 260, height: '100%', bgcolor: 'background.paper', pt: 2 }}
    >
      <Typography variant="h6" sx={{ px: 2, mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
        <TheatersIcon sx={{ mr: 1, fontSize: '2rem', color: 'primary.main' }} />
        Movie Explorer
      </Typography>
      <List>
        {navLinks.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={RouterNavLink} // Use NavLink here
              to={item.path}
              end // Add 'end' prop for exact matching on '/' route
              // Apply active style using style prop which NavLink supports
              style={({ isActive }) => isActive ? activeDrawerStyle : { color: theme.palette.text.primary } }
              sx={{ py: 1.5, px: 2 }}
            >
              <ListItemIcon sx={{ minWidth: 'auto', mr: 2, color: 'inherit' }}> {/* Inherit color */}
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 'inherit' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const imdbYellow = '#F5C518'; // Keep for potential accents like logo

  return (
    <>
      <AppBar
        position="sticky"
        elevation={trigger ? 4 : 0} // Shadow appears on scroll
        sx={{
          bgcolor: trigger ? 'background.default' : alpha(theme.palette.background.default, 0.7),
          backdropFilter: trigger ? 'none' : 'blur(8px)', // Glass effect only when at top
          color: 'text.primary',
          transition: theme.transitions.create(['background-color', 'backdrop-filter', 'box-shadow'], {
            duration: theme.transitions.duration.short,
          }),
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: 56, sm: 64 } }}>
          {/* Left Side: Menu Icon and Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: { xs: 1, sm: 1.5 }, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <RouterNavLink to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
              <TheatersIcon sx={{ mr: 1, fontSize: {xs: '1.8rem', sm: '2.2rem'}, color: imdbYellow /* Accent color */ }} />
              <Typography
                variant="h6"
                noWrap
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  fontWeight: 700,
                  letterSpacing: '.02rem',
                  fontFamily: 'monospace', // Example font change
                }}
              >
                Movie<Box component="span" sx={{ fontWeight: 400 }}>Explorer</Box>
              </Typography>
            </RouterNavLink>
          </Box>

          {/* Center: Search Bar */}
          <Box
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              position: 'relative',
              borderRadius: '10px',
              backgroundColor: alpha(theme.palette.action.selected, 0.08),
              border: '1px solid transparent',
              transition: theme.transitions.create(['background-color', 'border-color']),
              '&:hover': {
                backgroundColor: alpha(theme.palette.action.selected, 0.12),
              },
              '&:focus-within': {
                backgroundColor: alpha(theme.palette.action.selected, 0.15),
                borderColor: theme.palette.primary.main,
              },
              mx: 2,
              flexGrow: 1,
              maxWidth: '600px',
            }}
          >
            <IconButton type="submit" sx={{ p: '10px', color: 'text.secondary' }} aria-label="search">
              <SearchIcon />
            </IconButton>
            <InputBase
              placeholder="Search movies…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                color: 'inherit',
                width: '100%',
                fontSize: '0.95rem',
                '& .MuiInputBase-input': {
                  py: '8px',
                  px: 1,
                },
              }}
            />
          </Box>

          {/* Right Side: Desktop Links, Search Icon (Mobile), Theme Toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', mr: 1 }}>
              {navLinks.map((item) => (
                <Button
                  key={item.text}
                  component={RouterNavLink} // Use NavLink for active class
                  to={item.path}
                  end // Add 'end' prop for exact matching on '/' route
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 500,
                    mx: 1, // Adjusted horizontal margin
                    textTransform: 'none', // Keep text case as defined
                    fontSize: '1rem', // <<<< INCREASED FONT SIZE
                    '&:hover': {
                      color: 'text.primary',
                      bgcolor: alpha(theme.palette.action.hover, 0.04)
                    },
                    // NavLink adds 'active' class by default
                    '&.active': {
                      color: 'primary.main', // Active link color
                      fontWeight: 'bold',
                    }
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>

            {/* Mobile Search Icon - Navigates */}
            <IconButton
              title="Search"
              color="inherit"
              sx={{ display: { xs: 'flex', md: 'none' }, ml: 1 }}
              onClick={() => {
                // Navigate to search page, include query if present
                const term = searchQuery.trim();
                navigate(term ? `/search?query=${encodeURIComponent(term)}` : '/search');
              }}
            >
              <SearchIcon />
            </IconButton>

            {/* Theme Toggle */}
            <IconButton
              title={`Toggle ${mode === 'dark' ? 'light' : 'dark'} mode`}
              sx={{ ml: 1 }}
              onClick={toggleTheme} // Connect to your actual theme toggling function
              color="inherit"
            >
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }} // Better open performance on mobile.
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 260, bgcolor: 'background.paper' },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default Navbar;