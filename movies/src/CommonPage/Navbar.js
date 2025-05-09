// src/components/Navbar.js
import React, { useState, useEffect } from "react";
import { NavLink as RouterNavLink, useNavigate } from "react-router-dom";

// MUI Components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useTheme, alpha, keyframes } from "@mui/material/styles";
import useScrollTrigger from "@mui/material/useScrollTrigger";

// MUI Icons
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";

// Contexts
import { useMovieData } from "../context/MovieDataContext"; 
import { useThemeContext } from "../context/ThemeContext"; 

// --- CLERK IMPORTS ---
import { useUser, useClerk } from "@clerk/clerk-react";

// Animations
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const textPopIn = keyframes`
  0% { transform: scale(0.8) translateY(5px); opacity: 0; }
  70% { transform: scale(1.05) translateY(-2px); opacity: 0.7; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
`;

const Navbar = () => {
  const theme = useTheme(); // MUI theme
  const { lastSearch } = useMovieData();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeContext(); // Your custom theme context

  // Clerk Hooks
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 10 });
  const [anchorElUser, setAnchorElUser] = useState(null);

  useEffect(() => {
    if (lastSearch && document.activeElement?.tagName !== "INPUT") {
      setSearchQuery(lastSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastSearch]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const term = searchQuery.trim();
    if (term) {
      navigate(`/search?query=${encodeURIComponent(term)}`);
      if (mobileOpen) setMobileOpen(false);
    }
  };

  // --- Define NavLinks for Drawer ---
  const baseNavLinksForDrawer = [
    { text: "Home", icon: <HomeOutlinedIcon />, path: "/" },
    { text: "Movies", icon: <MovieOutlinedIcon />, path: "/movies" },
  ];

  const drawerNavLinks = isSignedIn
    ? [
        ...baseNavLinksForDrawer,
        {
          text: "Favorites",
          icon: <FavoriteBorderOutlinedIcon />,
          path: "/favorites",
        },
        { text: "Profile", icon: <PersonOutlineIcon />, path: "/user-profile" },
        // Logout is an action, not a NavLink path
      ]
    : [
        ...baseNavLinksForDrawer,
        { text: "Login", icon: <LoginOutlinedIcon />, path: "/sign-in" },
        { text: "Sign Up", icon: <PersonAddOutlinedIcon />, path: "/sign-up" },
      ];

  // --- Define NavLinks for Desktop ---
  const desktopBaseNavLinks = [
    { text: "Home", path: "/" },
    { text: "Movies", path: "/movies" },
  ];

  const activeDrawerStyle = {
    fontWeight: "bold",
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
    borderLeft: `3px solid ${theme.palette.primary.main}`,
  };

  const defaultDrawerStyle = {
    color: theme.palette.text.primary, // Ensure color is always defined
    borderLeft: "3px solid transparent",
  };

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{
        textAlign: "left",
        width: 260,
        height: "100%",
        bgcolor: "background.paper",
        pt: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ px: 2, mb: 2, display: "flex", alignItems: "center" }}>
        <LocalMoviesIcon
          sx={{ mr: 1.5, fontSize: "2.2rem", color: "primary.main" }}
        />
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "text.primary" }}
        >
          Cine City
        </Typography>
      </Box>
      <List sx={{ flexGrow: 1 }}>
        {drawerNavLinks.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={RouterNavLink}
              to={item.path} // All items in drawerNavLinks now have a path
              end={item.path === "/"}
              style={({ isActive }) =>
                isActive ? activeDrawerStyle : defaultDrawerStyle
              }
              sx={{
                py: 1.2,
                px: 2,
                borderRadius: 1,
                "&:hover": { bgcolor: alpha(theme.palette.action.hover, 0.06) },
              }}
            >
              <ListItemIcon sx={{ minWidth: "auto", mr: 2, color: "inherit" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: "inherit",
                  fontSize: "0.95rem",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        {/* Separate Logout button in Drawer if signed in */}
        {isSignedIn && (
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={async () => {
                handleDrawerToggle(); // Close drawer first
                await signOut(() => navigate("/")); // Then sign out and navigate
              }}
              sx={{
                py: 1.2,
                px: 2,
                borderRadius: 1,
                color: "text.primary",
                "&:hover": { bgcolor: alpha(theme.palette.action.hover, 0.06) },
              }}
            >
              <ListItemIcon sx={{ minWidth: "auto", mr: 2, color: "inherit" }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  fontWeight: "inherit",
                  fontSize: "0.95rem",
                }}
              />
            </ListItemButton>
          </ListItem>
        )}
      </List>
      <Divider />
      <ListItem disablePadding>
        <ListItemButton onClick={toggleTheme} sx={{ py: 1.5, px: 2 }}>
          <ListItemIcon
            sx={{ minWidth: "auto", mr: 2, color: "text.secondary" }}
          >
            {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </ListItemIcon>
          <ListItemText
            primary={`Switch to ${mode === "dark" ? "Light" : "Dark"} Mode`}
            sx={{ color: "text.secondary" }}
            primaryTypographyProps={{ fontSize: "0.9rem" }}
          />
        </ListItemButton>
      </ListItem>
    </Box>
  );

  const accentColor = theme.palette.accent?.main || "#F5C518";

  // Common styles for desktop navigation buttons
  const desktopNavLinkSx = (currentTheme) => ({
    // Changed param name to avoid conflict
    color: currentTheme.palette.text.secondary,
    fontWeight: 500,
    mx: 0.25,
    textTransform: "capitalize",
    fontSize: "0.9rem",
    letterSpacing: "0.025em",
    borderRadius: "16px",
    px: 1.75,
    py: 0.75,
    transition: currentTheme.transitions.create([
      "color",
      "background-color",
      "transform",
    ]),
    position: "relative",
    overflow: "hidden",
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: "4px",
      left: "50%",
      transform: "translateX(-50%) scaleX(0)",
      width: "0%",
      height: "2px",
      backgroundColor: currentTheme.palette.primary.main,
      transition: currentTheme.transitions.create(["width", "transform"]),
    },
    "&:hover": {
      color: currentTheme.palette.text.primary,
      bgcolor: alpha(currentTheme.palette.action.hover, 0.08),
      transform: "translateY(-1px)",
    },
    "&.active": {
      color: currentTheme.palette.primary.main,
      fontWeight: "600",
      "&::after": { width: "60%", transform: "translateX(-50%) scaleX(1)" },
    },
  });

  return (
    <>
      <AppBar
        position="sticky"
        elevation={trigger ? 3 : 0}
        sx={{
          bgcolor: trigger
            ? alpha(theme.palette.background.paper, 0.85)
            : "transparent",
          backdropFilter: trigger ? "blur(10px)" : "none",
          color: theme.palette.text.primary,
          transition: theme.transitions.create(
            ["background-color", "backdrop-filter", "box-shadow", "color"],
            {
              duration: theme.transitions.duration.standard,
            }
          ),
          borderBottom: trigger
            ? "none"
            : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            minHeight: { xs: 56, sm: 64 },
          }}
        >
          {/* Left Side */}
          <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: { xs: 0.5, sm: 1.5 }, display: { md: "none" } }}
            >
              {" "}
              <MenuIcon />{" "}
            </IconButton>
            <RouterNavLink
              to="/"
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                alignItems: "center",
              }}
            >
              <LocalMoviesIcon
                sx={{
                  mr: 1,
                  fontSize: { xs: "2rem", sm: "2.4rem" },
                  color: accentColor,
                  animation: `${fadeIn} 0.8s ease-out 0.1s both`,
                }}
              />
              <Typography
                variant="h5"
                noWrap
                sx={{
                  display: { xs: "none", sm: "flex" },
                  fontWeight: 700,
                  letterSpacing: ".05rem",
                  fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
                  overflow: "hidden",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    animation: `${textPopIn} 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s both`,
                  }}
                >
                  {" "}
                  Cine{" "}
                </Box>
                <Box
                  component="span"
                  sx={{
                    color: accentColor,
                    animation: `${textPopIn} 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s both`,
                    ml: "5px",
                  }}
                >
                  {" "}
                  City{" "}
                </Box>
              </Typography>
            </RouterNavLink>
          </Box>

          {/* Center: Search Bar */}
          <Box
            component="form"
            onSubmit={handleSearchSubmit}
            sx={(currentTheme) => ({
              // Use currentTheme from useTheme()
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              position: "relative",
              borderRadius: "25px",
              backgroundColor: alpha(currentTheme.palette.action.selected, 0.1),
              border: `1px solid ${alpha(currentTheme.palette.divider, 0.5)}`,
              transition: currentTheme.transitions.create([
                "background-color",
                "border-color",
                "box-shadow",
              ]),
              "&:hover": {
                backgroundColor: alpha(
                  currentTheme.palette.action.selected,
                  0.15
                ),
                borderColor: currentTheme.palette.divider,
              },
              "&:focus-within": {
                backgroundColor: alpha(
                  currentTheme.palette.action.selected,
                  0.2
                ),
                borderColor: currentTheme.palette.primary.main,
                boxShadow: `0 0 0 2px ${alpha(
                  currentTheme.palette.primary.main,
                  0.3
                )}`,
              },
              mx: 2,
              flexGrow: 1,
              maxWidth: "550px",
            })}
          >
            <IconButton
              type="submit"
              sx={{ p: "10px", color: "text.secondary" }}
              aria-label="search"
            >
              {" "}
              <SearchIcon />{" "}
            </IconButton>
            <InputBase
              placeholder="Search Cine City…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                color: "inherit",
                width: "100%",
                fontSize: "0.9rem",
                "& .MuiInputBase-input": { py: "10px", px: 1 },
              }}
            />
          </Box>

          {/* Right Side: Desktop Links, User Menu/Login, Theme Toggle */}
          <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            {/* Desktop Navigation Links */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                mr: 0.5,
              }}
            >
              {desktopBaseNavLinks.map(
                (
                  item // Use desktopBaseNavLinks
                ) => (
                  <Button
                    key={item.text}
                    component={RouterNavLink}
                    to={item.path}
                    end={item.path === "/"}
                    sx={desktopNavLinkSx(theme)}
                  >
                    {item.text}
                  </Button>
                )
              )}
              {isSignedIn && (
                <Button
                  component={RouterNavLink}
                  to="/favorites"
                  sx={desktopNavLinkSx(theme)}
                >
                  Favorites
                </Button>
              )}
            </Box>

            {/* Mobile Search Icon */}
            <IconButton
              title="Search"
              color="inherit"
              sx={{ display: { xs: "flex", md: "none" }, ml: 0.5 }}
              onClick={() => {
                const term = searchQuery.trim();
                navigate(
                  term ? `/search?query=${encodeURIComponent(term)}` : "/search"
                );
              }}
            >
              <SearchIcon />
            </IconButton>

            {/* User Authentication Section */}
            {isSignedIn ? (
              <>
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{ p: 0, ml: 1.5, width: 36, height: 36 }}
                >
                  <Avatar
                    alt={
                      user?.fullName ||
                      user?.primaryEmailAddress?.emailAddress ||
                      "User"
                    }
                    src={user?.imageUrl}
                    sx={{
                      width: 32,
                      height: 32,
                      border: `2px solid ${theme.palette.primary.light}`,
                    }}
                  >
                    {!user?.imageUrl && (
                      <AccountCircleIcon sx={{ fontSize: "2rem" }} />
                    )}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.2))",
                      mt: 1.5,
                      bgcolor: "background.paper",
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&::before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem
                    onClick={() => {
                      handleCloseUserMenu();
                      navigate("/user-profile");
                    }}
                  >
                    {" "}
                    <ListItemIcon>
                      <PersonOutlineIcon fontSize="small" />
                    </ListItemIcon>{" "}
                    Profile{" "}
                  </MenuItem>
                  <Divider sx={{ my: 0.5 }} />
                  <MenuItem
                    onClick={async () => {
                      handleCloseUserMenu();
                      await signOut(() => navigate("/"));
                    }}
                  >
                    {" "}
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>{" "}
                    Logout{" "}
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={RouterNavLink}
                to="/sign-in"
                sx={desktopNavLinkSx(theme)}
              >
                Login
              </Button>
            )}

            {/* Theme Toggle */}
            <IconButton
              title={`Toggle ${mode === "dark" ? "light" : "dark"} mode`}
              sx={{ ml: { xs: 0.5, sm: 1 } }}
              onClick={toggleTheme}
              color="inherit"
            >
              {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 260,
              bgcolor: "background.paper",
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default Navbar;
