// src/context/MovieDataContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import {
  getTrendingMovies,
  // Add imports for getPopularMovies, getTopRatedMovies, getUpcomingMovies
  searchMovies as searchMoviesApi, // Your API search function
  getApiConfig,
} from '../services/tmdbService'; // Ensure this path is correct

// Define Movie Type (align with TMDb structure) - ensure this is defined or imported
// export interface Movie { id: number; title: string; /* ... other props ... */ }

const MovieDataContext = createContext(undefined);

export const useMovieData = () => {
  const context = useContext(MovieDataContext);
  if (context === undefined) {
    throw new Error('useMovieData must be used within a MovieDataProvider');
  }
  return context;
};

export const MovieDataProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('movieExplorerFavorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [trendingMovies, setTrendingMoviesState] = useState([]);
  const [popularMovies, setPopularMoviesState] = useState([]);
  const [topRatedMovies, setTopRatedMoviesState] = useState([]);
  const [newReleases, setNewReleasesState] = useState([]);

  const [loadingStates, setLoadingStates] = useState({
    featured: true, trending: true, popular: true,
    topRated: true, newReleases: true,
  });
  const [initialDataError, setInitialDataError] = useState(null);

  // ---- Search State ----
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQueryState] = useState(''); // Internal state for search query
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  // ---- End Search State ----

  const [lastSearch, setLastSearchState] = useState(() => { // Renamed for clarity
    return localStorage.getItem('movieExplorerLastSearch') || '';
  });

  useEffect(() => {
    localStorage.setItem('movieExplorerFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const setLastSearch = useCallback((query) => { // Expose this function
    if (query && query.trim()) {
      localStorage.setItem('movieExplorerLastSearch', query.trim());
      setLastSearchState(query.trim());
    } else {
      localStorage.removeItem('movieExplorerLastSearch');
      setLastSearchState('');
    }
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await getApiConfig();
        setLoadingStates(prev => ({ ...prev, featured: true, topRated: true }));
        const topRatedData = await getTrendingMovies('week', 1); // Replace with getTopRatedMovies
        const sortedTopRated = [...(topRatedData.results || [])].sort((a, b) => b.vote_average - a.vote_average).slice(0,5);
        setFeaturedMovies(sortedTopRated);
        setTopRatedMoviesState((topRatedData.results || []).slice(0, 12));
        setLoadingStates(prev => ({ ...prev, featured: false, topRated: false }));

        setLoadingStates(prev => ({ ...prev, trending: true }));
        const trendingData = await getTrendingMovies('day', 1);
        setTrendingMoviesState((trendingData.results || []).slice(0, 12));
        setLoadingStates(prev => ({ ...prev, trending: false }));

        setLoadingStates(prev => ({ ...prev, popular: true }));
        const popularData = await getTrendingMovies('week', 2); // Replace with getPopularMovies
        setPopularMoviesState((popularData.results || []).slice(0, 12));
        setLoadingStates(prev => ({ ...prev, popular: false }));

        setLoadingStates(prev => ({ ...prev, newReleases: true }));
        const upcomingData = await getTrendingMovies('day', 3); // Replace with getUpcomingMovies
        const sortedUpcoming = [...(upcomingData.results || [])].sort((a, b) => new Date(b.release_date) - new Date(a.release_date)).slice(0, 12);
        setNewReleasesState(sortedUpcoming);
        setLoadingStates(prev => ({ ...prev, newReleases: false }));

      } catch (err) {
        console.error("Failed to fetch initial movie data:", err);
        setInitialDataError("Could not load movie data. Please try again later.");
        setLoadingStates({ featured: false, trending: false, popular: false, topRated: false, newReleases: false });
      }
    };
    fetchAllData();
  }, []);

  const toggleFavorite = useCallback((movie) => {
    setFavorites((prevFavorites) => {
      const isFav = prevFavorites.find(fav => fav.id === movie.id);
      if (isFav) {
        return prevFavorites.filter(fav => fav.id !== movie.id);
      } else {
        return [...prevFavorites, { id: movie.id, title: movie.title, poster_path: movie.poster_path, vote_average: movie.vote_average, release_date: movie.release_date, overview: movie.overview, backdrop_path: movie.backdrop_path }];
      }
    });
  }, []);

  const isFavorite = useCallback((movieId) => {
    return favorites.some(fav => fav.id === movieId);
  }, [favorites]);

  // ---- Search Functions ----
  const performSearch = useCallback(async (query, page = 1, filters = {}) => { // Added page and filters
    if (!query || !query.trim()) {
      setSearchResults([]);
      setSearchError(null);
      setSearchQueryState(''); // Clear internal query state
      return;
    }
    setIsSearching(true);
    setSearchError(null);
    setSearchQueryState(query.trim()); // Update internal query state with the searched term
    try {
      await getApiConfig();
      // TODO: Modify searchMoviesApi to accept filter parameters if implementing filters
      const data = await searchMoviesApi(query.trim(), page /*, filters */);
      setSearchResults(data.results || []);
      if (!data.results || data.results.length === 0) {
        setSearchError(`No results found for "${query.trim()}".`);
      }
    } catch (err) {
      console.error("Error searching movies:", err);
      setSearchError("Failed to fetch search results. Please try again.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // This is primarily for SearchResultsPage to update the query text
  // Navbar uses its own local state for typing, then calls navigate which updates URL.
  const updateSearchQuery = useCallback((query) => {
    setSearchQueryState(query);
  }, []);
  // ---- End Search Functions ----


  const value = {
    favorites, toggleFavorite, isFavorite,
    featuredMovies, trendingMovies, popularMovies, topRatedMovies, newReleases,
    loadingStates, initialDataError,
    lastSearch, setLastSearch, // For Navbar and persistence

    // Search related values
    searchResults,
    searchQuery,       // The current search term in context (searchQueryState)
    setSearchQuery: updateSearchQuery, // To allow SearchResultsPage to update the term
    performSearch,
    isSearching,
    searchError,
  };

  return (
    <MovieDataContext.Provider value={value}>
      {children}
    </MovieDataContext.Provider>
  );
};