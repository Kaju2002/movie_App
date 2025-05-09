// src/pages/MoviePage.js
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Rating from '@mui/material/Rating'; // For star rating display
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide'; // For mobile action bar transition
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { useTheme, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';     // <<< ADD IMPORT
import Toolbar from '@mui/material/Toolbar';   // <<< ADD IMPORT
// Context and API
import { useMovieData } from '../context/MovieDataContext';
import { getMovieDetails, getImageUrl, getMovieVideos, findTrailerKey } from '../services/tmdbService';

// Components
import CastList from '../components/CastList';
import Carousel from '../CommonPage/Corousel'; // Assuming path is correct
import TrailerModal from '../components/TrailerModal';

// MUI Icons
import StarIcon from '@mui/icons-material/Star'; // Filled star for rating
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // Clock
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TheatersIcon from '@mui/icons-material/Theaters'; // Film icon for genre? Or use CategoryIcon
import PublicIcon from '@mui/icons-material/Public'; // For original language/country maybe?
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CircularProgress from '@mui/material/CircularProgress';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'; // For mobile action bar maybe

const MoviePage = () => {
  const { id: movieId } = useParams(); // Get ID from URL
  const navigate = useNavigate();
  const theme = useTheme();
  const { toggleFavorite, isFavorite } = useMovieData(); // Context for favorites

  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Trailer State
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  const [currentTrailerKey, setCurrentTrailerKey] = useState(null);
  const [trailerLoading, setTrailerLoading] = useState(false);
  const [trailerError, setTrailerError] = useState(null);

  // State for mobile action bar visibility
  const trigger = useScrollTrigger({ threshold: 100 }); // Trigger after scrolling down 100px

  const isFavorited = movie ? isFavorite(movie.id) : false;
  const imdbYellow = '#F5C518'; // Consistent color

  // Fetch movie details
  useEffect(() => {
    const fetchDetails = async () => {
      if (!movieId) {
        setError("No movie ID provided.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const data = await getMovieDetails(movieId); // Fetch details, credits, videos, etc.
        if (data) {
          setMovie(data);
          document.title = `${data.title} (${data.release_date?.substring(0, 4) || 'N/A'}) - Movie Explorer`;
        } else {
          setError("Movie not found.");
        }
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError("Failed to load movie details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();

    // Cleanup document title on unmount
    return () => { document.title = 'Movie Explorer'; };
  }, [movieId]); // Re-fetch if movieId changes

  // --- Trailer Handlers ---
  const handleOpenTrailerModal = useCallback(async () => {
    if (!movie?.id) return;
    setTrailerLoading(true);
    setTrailerError(null);
    setCurrentTrailerKey(null);
    try {
        // Videos might already be in movie details if using append_to_response
        const videos = movie.videos?.results || await getMovieVideos(movie.id);
        const key = findTrailerKey(videos);
        if (key) {
            setCurrentTrailerKey(key);
            setTrailerModalOpen(true);
        } else {
            // Show snackbar or alert - reusing trailerError state
             setTrailerError(`No trailer found for ${movie.title}.`);
        }
    } catch (error) {
        console.error("Error fetching trailer:", error);
        setTrailerError("Could not load trailer.");
    } finally {
        setTrailerLoading(false);
    }
  }, [movie]); // Depend on movie state

  const handleCloseTrailerModal = () => {
    setTrailerModalOpen(false);
    setTimeout(() => setCurrentTrailerKey(null), 300);
  };
  // --- End Trailer Handlers ---

  // Helper to format runtime
  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours}h ` : ''}${mins}m`;
  };

  // --- Render Logic ---
  if (isLoading) {
    // Basic full page loading skeleton
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
         <Skeleton variant="rectangular" width="100%" height={300} sx={{ mb: 3 }} />
         <Grid container spacing={3}>
            <Grid item xs={12} md={4} lg={3}>
                 <Skeleton variant="rectangular" width="100%" sx={{ aspectRatio: '2/3' }}/>
            </Grid>
             <Grid item xs={12} md={8} lg={9}>
                 <Skeleton variant="text" width="80%" height={60} />
                 <Skeleton variant="text" width="60%" height={30} />
                 <Skeleton variant="text" width="90%" />
                 <Skeleton variant="text" width="95%" />
                 <Skeleton variant="text" width="85%" />
            </Grid>
         </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 5, textAlign: 'center' }}>
        <Alert severity="error" sx={{ justifyContent: 'center', mb: 2 }}>{error}</Alert>
        <Button variant="outlined" onClick={() => navigate('/')}>Go Home</Button>
      </Container>
    );
  }

  if (!movie) {
    // Should be caught by error state, but good fallback
    return (
       <Container sx={{ py: 5, textAlign: 'center' }}>
        <Typography variant="h5">Movie data could not be loaded.</Typography>
       </Container>
    );
  }

  // Process data for display
  const posterUrl = getImageUrl(movie.poster_path, 'w500'); // Larger size for details page
  const backdropUrl = getImageUrl(movie.backdrop_path, 'original');
  const year = movie.release_date ? movie.release_date.substring(0, 4) : 'N/A';
  const ratingOutOf10 = movie.vote_average ? (movie.vote_average).toFixed(1) : 'N/A';
  const ratingOutOf5 = movie.vote_average ? (movie.vote_average / 2) : 0; // For MUI Rating component
  const genres = movie.genres?.map(g => g.name) || [];
  const runtimeFormatted = formatRuntime(movie.runtime);
  const director = movie.credits?.crew?.find(person => person.job === 'Director')?.name || 'N/A';
  const writers = movie.credits?.crew?.filter(person => person.department === 'Writing').map(p => p.name).slice(0, 3).join(', ') || 'N/A'; // Show up to 3 writers
  const cast = movie.credits?.cast || [];
  const photos = movie.images?.backdrops?.slice(0, 8) || []; // Get up to 8 backdrops
  const similarMovies = movie.similar?.results || movie.recommendations?.results || []; // Use similar or recommendations

  return (
    <>
    <Box sx={{ bgcolor: 'background.default', color: 'text.primary', pb: 8 }}> {/* Padding bottom for mobile action bar */}
      {/* 1. Backdrop Section */}
      <Box
        sx={{
          height: { xs: '40vh', sm: '55vh', md: '60vh' },
          position: 'relative',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundImage: `url(${backdropUrl})`,
          '&::before': { // Gradient overlay
            content: '""',
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(to top, ${theme.palette.background.default} 10%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)`,
            zIndex: 0,
          },
        }}
      />

      {/* 2. Main Content Section (Poster + Info) */}
      <Container maxWidth="xl" sx={{ mt: { xs: -15, sm: -20, md: -25 }, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {/* Poster Column */}
          <Grid item xs={12} sm={4} md={3}>
            <Box sx={{ position: 'sticky', top: '80px' }}> {/* Make poster sticky on scroll */}
              <Paper elevation={6} sx={{ aspectRatio: '2/3', overflow: 'hidden', mb: 2 }}>
                <img src={posterUrl} alt={movie.title} style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }} />
              </Paper>
               {/* Desktop Trailer Button */}
              <Button
                  fullWidth
                  variant="contained"
                  startIcon={trailerLoading ? <CircularProgress size={20} color="inherit"/> : <PlayCircleOutlineIcon />}
                  onClick={handleOpenTrailerModal}
                  disabled={trailerLoading}
                  sx={{
                      mb: 1, display: { xs: 'none', md: 'flex' }, // Hide on mobile
                      bgcolor: alpha(theme.palette.common.white, 0.15),
                      color: 'white', '&:hover': { bgcolor: alpha(theme.palette.common.white, 0.25) }
                  }}
              > Watch Trailer </Button>
               {/* Desktop Add to Favorites Button */}
               <Button
                  fullWidth
                  variant={isFavorited ? "contained" : "outlined"}
                  color={isFavorited ? "primary" : "inherit"}
                  startIcon={isFavorited ? <BookmarkAddedIcon /> : <BookmarkAddOutlinedIcon />}
                  onClick={() => toggleFavorite(movie)}
                   sx={{ display: { xs: 'none', md: 'flex' } }} // Hide on mobile
                > {isFavorited ? 'In Favorites' : 'Add to Favorites'} </Button>
            </Box>
          </Grid>

          {/* Info Column */}
          <Grid item xs={12} sm={8} md={9}>
            {/* Title */}
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>
              {movie.title}
              <Typography component="span" variant="h4" sx={{ fontWeight: 'normal', color: 'text.secondary', ml: 1.5 }}>
                ({year})
              </Typography>
            </Typography>

            {/* Meta Info (Genres, Runtime, Release Date) */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: 2 }}>
              {genres.map(genre => <Chip key={genre} label={genre} size="small" variant="outlined" />)}
              {runtimeFormatted !== 'N/A' && <Typography variant="body2" sx={{ color: 'text.secondary' }}>• {runtimeFormatted}</Typography>}
              {movie.release_date && <Typography variant="body2" sx={{ color: 'text.secondary' }}>• {new Date(movie.release_date).toLocaleDateString()}</Typography>}
            </Box>

            {/* Rating and Desktop Actions */}
             <Box sx={{ display: {xs: 'none', md: 'flex'}, alignItems: 'center', gap: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StarIcon sx={{ color: imdbYellow, fontSize: '2rem' }} />
                    <Box>
                        <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold', lineHeight: 1.2 }}>
                           {ratingOutOf10} <Typography component="span" variant="body2" sx={{color: 'text.secondary'}}>/ 10</Typography>
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{movie.vote_count?.toLocaleString()} votes</Typography>
                    </Box>
                </Box>
                {/* MUI Rating component */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                     <Rating value={ratingOutOf5} precision={0.1} readOnly size="medium" />
                     <Button size="small" sx={{mt: 0.5, textTransform: 'none'}}>Rate</Button>
                </Box>
                 {/* Add to Favorites already below poster for desktop */}
            </Box>

            {/* Overview */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>Overview</Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>{movie.overview}</Typography>
            </Box>

            {/* Credits */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Director</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{director}</Typography>
                </Grid>
                 <Grid item xs={12} sm={6}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Writers</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{writers}</Typography>
                </Grid>
            </Grid>

             {/* Other Stats (Optional section) */}
             {/* ... You can add the stats grid from your tailwind example here if needed ... */}

             {/* Cast */}
             <Box sx={{ mb: 4 }}>
                <CastList cast={cast} />
             </Box>

             {/* Photos */}
             {photos.length > 0 && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                        Photos
                    </Typography>
                    <Grid container spacing={1}>
                        {photos.map((photo, index) => (
                         <Grid item key={index} xs={6} sm={4} md={3}>
                            <Paper elevation={1} sx={{ aspectRatio: '16/9', overflow: 'hidden', '&:hover img': { transform: 'scale(1.05)' } }}>
                                <img
                                    src={getImageUrl(photo.file_path, 'w500')}
                                    alt={`${movie.title} photo ${index + 1}`}
                                    loading="lazy"
                                    style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                                />
                            </Paper>
                         </Grid>
                        ))}
                    </Grid>
                </Box>
             )}

             {/* Similar Movies */}
             {similarMovies.length > 0 && (
                <Box sx={{ mb: 4 }}>
                     <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                        More Like This
                    </Typography>
                    <Carousel title="" movies={similarMovies} cardSize="medium" />
                </Box>
             )}

          </Grid>
        </Grid>
      </Container>

       {/* Floating Mobile Action Bar */}
       <Slide appear={false} direction="up" in={trigger}>
            <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0, display: { xs: 'block', md: 'none' }, bgcolor: alpha(theme.palette.background.paper, 0.95), backdropFilter: 'blur(5px)' }}>
                <Toolbar sx={{ justifyContent: 'space-around' }}>
                     <Button
                        sx={{ flexDirection: 'column', color: isFavorited ? 'primary.main' : 'text.secondary', minWidth: 'auto', p:0.5 }}
                        onClick={() => toggleFavorite(movie)}
                    >
                        {isFavorited ? <BookmarkAddedIcon/> : <BookmarkAddOutlinedIcon/>}
                        <Typography variant="caption" sx={{ mt: 0.5, lineHeight: 1 }}>{isFavorited ? 'Saved' : 'Save'}</Typography>
                    </Button>
                     <Button
                        sx={{ flexDirection: 'column', color: 'text.secondary', minWidth: 'auto', p:0.5 }}
                        onClick={handleOpenTrailerModal}
                        disabled={trailerLoading}
                    >
                        {trailerLoading ? <CircularProgress size={24} /> : <PlayCircleOutlineIcon/>}
                        <Typography variant="caption" sx={{ mt: 0.5, lineHeight: 1 }}>Trailer</Typography>
                     </Button>
                    <Button sx={{ flexDirection: 'column', color: 'text.secondary', minWidth: 'auto', p:0.5 }}>
                        <StarIcon sx={{ color: imdbYellow }}/>
                        <Typography variant="caption" sx={{ mt: 0.5, lineHeight: 1 }}>Rate</Typography>
                    </Button>
                    {/* Add more actions if needed, e.g., Share */}
                </Toolbar>
            </AppBar>
       </Slide>

       {/* Trailer Modal */}
       <TrailerModal
            open={trailerModalOpen}
            handleClose={handleCloseTrailerModal}
            trailerKey={currentTrailerKey}
            title={movie.title}
        />
        {/* Snackbar for trailer errors (optional placement) */}
    </Box>
    {/* Snackbar can also be placed here, outside the main Box */}
    </>
  );
};

export default MoviePage;