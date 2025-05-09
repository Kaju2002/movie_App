// src/pages/SearchResultsPage.js
import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { useTheme, alpha } from "@mui/material/styles";

import { useMovieData } from "../context/MovieDataContext";
import MovieCard from "../components/MovieCard";

import SearchIconMUI from "@mui/icons-material/Search"; // Renamed to avoid conflict
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";

const SearchResultsPage = () => {
  const {
    searchResults,
    searchQuery: contextQuery, // Query from context
    setSearchQuery: setContextQuery, // To update context's query state (searchQueryState)
    performSearch,
    isSearching,
    searchError,
    setLastSearch,
  } = useMovieData();

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate(); // Not used in this version, but good to have if needed
  const theme = useTheme();

  const [localSearchInput, setLocalSearchInput] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ year: "", genre: "", rating: "" });

  const imdbYellow = "#F5C518";

  useEffect(() => {
    const queryFromUrl = searchParams.get("q");
    if (queryFromUrl) {
      setLocalSearchInput(queryFromUrl);
      // Update context's internal query state and perform search
      // This ensures context is aware of the current search term
      if (queryFromUrl !== contextQuery) {
        // Only update if different
        setContextQuery(queryFromUrl);
      }
      performSearch(queryFromUrl);
      setLastSearch(queryFromUrl);
    } else {
      // If no query in URL, clear context query and results
      setLocalSearchInput("");
      setContextQuery("");
      performSearch(""); // This will clear results
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, performSearch, setContextQuery, setLastSearch]); // contextQuery removed from deps

  const handleLocalSearchSubmit = (e) => {
    e.preventDefault();
    const term = localSearchInput.trim();
    if (term) {
      setSearchParams({ q: term }); // This will trigger the useEffect above
    } else {
      setSearchParams({}); // Clear URL, triggering useEffect to clear search
    }
  };

  const clearLocalSearch = () => {
    setLocalSearchInput("");
    setSearchParams({}); // Clear URL, triggering useEffect
  };

  const toggleFilters = () => setFilterOpen(!filterOpen);
  const handleFilterChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });
  const applyFilters = () => {
    const term = localSearchInput.trim() || searchParams.get("q") || "";
    if (term) {
      console.log("Applying filters:", filters, "for query:", term);
      // TODO: Call performSearch(term, 1, filters) - ensure performSearch handles filters
      performSearch(term, 1, filters); // Pass filters to performSearch
    }
    setFilterOpen(false);
  };
  const resetFilters = () => {
    setFilters({ year: "", genre: "", rating: "" });
    const term = localSearchInput.trim() || searchParams.get("q") || "";
    if (term) {
      performSearch(term, 1, {}); // Re-search with empty filters
    }
  };

  const genres = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Drama",
    "Fantasy",
    "Horror",
    "Sci-Fi",
    "Thriller",
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        color: "text.primary",
        minHeight: "calc(100vh - 128px)",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 4,
            bgcolor: alpha(theme.palette.background.paper, 0.85),
            backdropFilter: "blur(5px)",
            borderRadius: 2,
          }}
        >
          <Box
            component="form"
            onSubmit={handleLocalSearchSubmit}
            sx={{ position: "relative", display: "flex", alignItems: "center" }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search for movies..."
              value={localSearchInput}
              onChange={(e) => setLocalSearchInput(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  pr: localSearchInput ? "50px" : "14px",
                  "& fieldset": {
                    borderColor: alpha(theme.palette.text.primary, 0.23),
                  },
                  "&:hover fieldset": {
                    borderColor: alpha(theme.palette.text.primary, 0.5),
                  },
                  "&.Mui-focused fieldset": { borderColor: imdbYellow },
                },
                input: { py: 1.5 },
              }}
            />
            {localSearchInput && (
              <IconButton
                type="button"
                onClick={clearLocalSearch}
                aria-label="Clear search"
                sx={{
                  position: "absolute",
                  right: { xs: 45, sm: 50 },
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "text.secondary",
                }}
              >
                {" "}
                <ClearIcon />{" "}
              </IconButton>
            )}
            <IconButton
              type="submit"
              aria-label="Search"
              sx={{
                ml: 1,
                color: imdbYellow,
                bgcolor: alpha(imdbYellow, 0.1),
                "&:hover": { bgcolor: alpha(imdbYellow, 0.2) },
              }}
            >
              <SearchIconMUI />
            </IconButton>
          </Box>

          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              startIcon={<FilterListIcon />}
              onClick={toggleFilters}
              size="small"
              sx={{ color: "text.secondary", textTransform: "none" }}
            >
              {filterOpen ? "Hide Filters" : "Show Filters"}
            </Button>
            {contextQuery && !isSearching && searchResults.length > 0 && (
              <Typography variant="caption" color="text.secondary">
                {searchResults.length} result
                {searchResults.length !== 1 ? "s" : ""}
              </Typography>
            )}
          </Box>

          <Collapse in={filterOpen}>
            <Box
              sx={{
                mt: 2,
                pt: 2,
                borderTop: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Grid container spacing={2}>
                {["year", "genre", "rating"].map((filterType) => (
                  <Grid item xs={12} sm={4} key={filterType}>
                    <FormControl fullWidth size="small">
                      <InputLabel>
                        {filterType.charAt(0).toUpperCase() +
                          filterType.slice(1)}
                      </InputLabel>
                      <Select
                        name={filterType}
                        value={filters[filterType]}
                        label={
                          filterType.charAt(0).toUpperCase() +
                          filterType.slice(1)
                        }
                        onChange={handleFilterChange}
                      >
                        <MenuItem value="">
                          <em>
                            All{" "}
                            {filterType === "genre"
                              ? "Genres"
                              : filterType.charAt(0).toUpperCase() +
                                filterType.slice(1)}
                            s
                          </em>
                        </MenuItem>
                        {filterType === "year" &&
                          years.map((y) => (
                            <MenuItem key={y} value={y}>
                              {y}
                            </MenuItem>
                          ))}
                        {filterType === "genre" &&
                          genres.map((g) => (
                            <MenuItem key={g} value={g}>
                              {g}
                            </MenuItem>
                          ))}
                        {filterType === "rating" &&
                          [9, 8, 7, 6, 5].map((r) => (
                            <MenuItem key={r} value={r}>
                              {r}+
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>
                ))}
              </Grid>
              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 1,
                }}
              >
                <Button
                  onClick={resetFilters}
                  size="small"
                  sx={{ color: "text.secondary" }}
                >
                  Reset
                </Button>
                <Button
                  onClick={applyFilters}
                  variant="contained"
                  size="small"
                  sx={{
                    bgcolor: imdbYellow,
                    color: "black",
                    "&:hover": { bgcolor: alpha(imdbYellow, 0.8) },
                  }}
                >
                  Apply Filters
                </Button>
              </Box>
            </Box>
          </Collapse>
        </Paper>

        {isSearching && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress />
          </Box>
        )}
        {!isSearching && searchError && (
          <Alert severity="info" sx={{ justifyContent: "center" }}>
            {searchError}
          </Alert>
        )}
        {!isSearching &&
          !searchError &&
          contextQuery &&
          searchResults.length > 0 && (
            <>
              <Typography
                variant="h5"
                component="h1"
                gutterBottom
                sx={{ mb: 3 }}
              >
                Results for "{contextQuery}"
              </Typography>
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                {searchResults.map((movie) => (
                  <Grid
                    item
                    key={movie.id}
                    xs={6}
                    sm={4}
                    md={3}
                    lg={2.4}
                    xl={2}
                  >
                    <MovieCard movie={movie} size="medium" />
                  </Grid>
                ))}
              </Grid>
              {/* TODO: Implement Infinite Scrolling or "Load More" Button Here */}
            </>
          )}
        {!isSearching &&
          !searchError &&
          !contextQuery && ( // Show when no search term is active
            <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
              <ManageSearchIcon sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Find Your Next Favorite Movie
              </Typography>
              <Typography>
                Use the search bar above to discover movies.
              </Typography>
            </Box>
          )}
      </Container>
    </Box>
  );
};

export default SearchResultsPage;
