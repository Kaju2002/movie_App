// src/pages/AllMoviesPage.js
import React, { useEffect, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Paper from "@mui/material/Paper";
import Grow from "@mui/material/Grow";
import { useTheme, alpha, keyframes } from "@mui/material/styles";

import { useMovieData } from "../context/MovieDataContext";
import MovieCard from "../components/MovieCard";

import SortIcon from "@mui/icons-material/Sort";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchOffIcon from "@mui/icons-material/SearchOff";

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const slideUp = keyframes`from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); }`;

const AllMoviesPage = () => {
  const theme = useTheme();
  const {
    allMovies,
    allMoviesCurrentPage,
    allMoviesTotalPages,
    isLoadingMoreAllMovies,
    allMoviesError,
    fetchOrLoadMoreAllMovies,
    currentAllMoviesSortBy,
  } = useMovieData();

  const [sortBy, setSortBy] = useState(currentAllMoviesSortBy);

  useEffect(() => {
    if (allMovies.length === 0 || sortBy !== currentAllMoviesSortBy) {
      fetchOrLoadMoreAllMovies(sortBy, {}, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, fetchOrLoadMoreAllMovies, currentAllMoviesSortBy]);

  const handleLoadMore = () => {
    if (!isLoadingMoreAllMovies && allMoviesCurrentPage < allMoviesTotalPages) {
      fetchOrLoadMoreAllMovies(sortBy, {});
    }
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const sortOptions = [
    { value: "popularity.desc", label: "Popularity Descending" },
    { value: "popularity.asc", label: "Popularity Ascending" },
    { value: "release_date.desc", label: "Release Date Descending" },
    { value: "release_date.asc", label: "Release Date Ascending" },
    { value: "vote_average.desc", label: "Rating Descending" },
    { value: "vote_average.asc", label: "Rating Ascending" },
    { value: "original_title.asc", label: "Title (A-Z)" },
    { value: "original_title.desc", label: "Title (Z-A)" },
  ];

  // --- Initial loading state for the very first page load ---
  // We use isLoadingMoreAllMovies because fetchOrLoadMoreAllMovies sets this.
  const isFirstLoad =
    isLoadingMoreAllMovies && allMovies.length === 0 && !allMoviesError;

  if (isFirstLoad) {
    return (
      <Container
        maxWidth="xl"
        sx={{
          py: 4,
          bgcolor: "background.default",
          animation: `${fadeIn} 0.5s ease-out`,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            mb: 4,
            textAlign: "center",
            color: "text.primary",
          }}
        >
          Discover Movies
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress size={50} />
        </Box>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        color: "text.primary",
        minHeight: "calc(100vh - 128px)",
        py: { xs: 3, sm: 4 },
        animation: `${fadeIn} 0.5s ease-out`,
      }}
    >
      <Container maxWidth="xl">
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: { xs: 3, sm: 4 },
            textAlign: "center",
            color: "text.primary",
            letterSpacing: "0.02em",
            animation: `${slideUp} 0.6s ease-out 0.2s both`,
            opacity: 0,
          }}
        >
          Discover Movies
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 1.5, sm: 2 },
            mb: { xs: 3, sm: 4 },
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: alpha(theme.palette.background.paper, 0.7),
            backdropFilter: "blur(5px)",
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            animation: `${slideUp} 0.6s ease-out 0.4s both`,
            opacity: 0,
          }}
        >
          <FormControl size="small" sx={{ minWidth: 240 }}>
            <InputLabel
              id="sort-by-all-movies-label"
              sx={{ color: "text.secondary" }}
            >
              Sort By
            </InputLabel>
            <Select
              labelId="sort-by-all-movies-label"
              value={sortBy}
              label="Sort By"
              onChange={handleSortChange}
              IconComponent={SortIcon}
              sx={{
                bgcolor: "background.default",
                borderRadius: 1.5,
                ".MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "text.secondary",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                },
              }}
            >
              {sortOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>

        {allMoviesError &&
          allMovies.length === 0 &&
          !isLoadingMoreAllMovies && (
            <Alert
              severity="error"
              sx={{ justifyContent: "center", mb: 3, p: 2 }}
            >
              {allMoviesError}
            </Alert>
          )}

        {allMovies.length > 0 ? (
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {allMovies.map((movie, index) => (
              // The key for the Grid item is important for React's list rendering.
              // The Grow component itself doesn't strictly need a key if its child structure is consistent.
              <Grid
                item
                xs={6}
                sm={4}
                md={3}
                lg={2.4}
                xl={2}
                key={`${movie.id}-${index}-${allMoviesCurrentPage}`}
              >
                <Grow
                  in={true}
                  timeout={Math.min(1000, (index % 10) * 100 + 300)}
                >
                  {/* The direct child of Grow is Box, which is fine. */}
                  <Box>
                    <MovieCard movie={movie} size="medium" />
                  </Box>
                </Grow>
              </Grid>
            ))}
          </Grid>
        ) : (
          !isFirstLoad &&
          !allMoviesError && (
            <Box
              sx={{
                textAlign: "center",
                mt: 6,
                color: "text.secondary",
                animation: `${fadeIn} 1s ease-out`,
              }}
            >
              <SearchOffIcon sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h6"> No movies found. </Typography>
              <Typography variant="body2">
                {" "}
                Try adjusting your sort criteria or check back later.{" "}
              </Typography>
            </Box>
          )
        )}

        {!isLoadingMoreAllMovies &&
          allMoviesCurrentPage < allMoviesTotalPages &&
          allMovies.length > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                py: 4,
                animation: `${fadeIn} 0.5s ease-out`,
              }}
            >
              <Button
                variant="contained"
                onClick={handleLoadMore}
                size="large"
                endIcon={<ExpandMoreIcon />}
                sx={{
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  fontWeight: "bold",
                  px: 4,
                  py: 1.25,
                  borderRadius: "25px",
                  boxShadow: theme.shadows[3],
                  "&:hover": {
                    bgcolor: "primary.dark",
                    boxShadow: theme.shadows[5],
                  },
                }}
              >
                Load More
              </Button>
            </Box>
          )}

        {isLoadingMoreAllMovies && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {allMoviesError && isLoadingMoreAllMovies && allMovies.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <Alert severity="warning" sx={{ p: 1.5 }}>
              {allMoviesError}
            </Alert>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default AllMoviesPage;
