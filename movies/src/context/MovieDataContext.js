// src/context/MovieDataContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import {
  // Core API functions
  getApiConfig,
  getTrendingMovies,
  searchMovies as searchMoviesApi, // Renamed for clarity in context

  // Specific list fetching functions for Homepage
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,

  // For "All Movies" page and potential filtering
  discoverAllMovies as discoverAllMoviesApi,
  getMovieGenres as getMovieGenresApi,

} from '../services/tmdbService'; // Ensure this path is correct

// Define Movie Type (align with TMDb structure) - you should have this in a types file
// export interface Movie { id: number; title: string; /* ... other props ... */ }

// --- CREATE THE CONTEXT ---
const MovieDataContext = createContext(undefined);

// Custom hook to use the context
export const useMovieData = () => {
  const context = useContext(MovieDataContext);
  if (context === undefined) {
    throw new Error('useMovieData must be used within a MovieDataProvider');
  }
  return context;
};

export const MovieDataProvider = ({ children }) => {
  // --- Favorites State ---
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('movieExplorerFavorites') || '[]'));

  // --- Homepage Sections State ---
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [trendingMovies, setTrendingMoviesState] = useState([]);
  const [popularMoviesList, setPopularMoviesListState] = useState([]); // Using 'List' suffix
  const [topRatedMoviesList, setTopRatedMoviesListState] = useState([]); // Using 'List' suffix
  const [newReleases, setNewReleasesState] = useState([]);

  const [loadingStates, setLoadingStates] = useState({
    featured: true, trending: true, popular: true,
    topRated: true, newReleases: true,
  });
  const [initialDataError, setInitialDataError] = useState(null);

  // --- Search State ---
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQueryState] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [searchCurrentPage, setSearchCurrentPage] = useState(1); // For search pagination
  const [searchTotalPages, setSearchTotalPages] = useState(1);   // For search pagination

  // --- Last Searched Term ---
  const [lastSearch, setLastSearchState] = useState(() => localStorage.getItem('movieExplorerLastSearch') || '');

  // --- "All Movies" Page State (NEW) ---
  const [allMovies, setAllMovies] = useState([]);
  const [allMoviesCurrentPage, setAllMoviesCurrentPage] = useState(0); // Start at 0 for initial fetch of page 1
  const [allMoviesTotalPages, setAllMoviesTotalPages] = useState(1);
  const [isLoadingMoreAllMovies, setIsLoadingMoreAllMovies] = useState(false);
  const [allMoviesError, setAllMoviesError] = useState(null);
  const [currentAllMoviesSortBy, setCurrentAllMoviesSortBy] = useState('popularity.desc');
  const [availableGenres, setAvailableGenres] = useState(null); // {map: {id: name}, list: [{id,name}]}
  // --- END "All Movies" State ---


  // --- useEffects for localStorage ---
  useEffect(() => { localStorage.setItem('movieExplorerFavorites', JSON.stringify(favorites)); }, [favorites]);

  const setLastSearch = useCallback((query) => {
    if (query && query.trim()) {
      localStorage.setItem('movieExplorerLastSearch', query.trim());
      setLastSearchState(query.trim());
    } else {
      localStorage.removeItem('movieExplorerLastSearch');
      setLastSearchState('');
    }
  }, []);

  // --- Fetch Initial Homepage Data & Genres ---
  useEffect(() => {
    const fetchInitialAppData = async () => {
      try {
        await getApiConfig();

        if (!availableGenres) {
            const genresData = await getMovieGenresApi(); // Fetches {map, list}
            setAvailableGenres(genresData || { map: {}, list: [] });
        }

        setLoadingStates({ featured: true, trending: true, popular: true, topRated: true, newReleases: true });
        const [ featRes, trendRes, popRes, topRes, upcRes ] = await Promise.allSettled([
          getTopRatedMovies(1), getTrendingMovies('day', 1), getPopularMovies(1),
          getTopRatedMovies(1), // Can fetch page 2 for variety: getTopRatedMovies(2)
          getUpcomingMovies(1)
        ]);

        if (featRes.status === 'fulfilled') setFeaturedMovies((featRes.value.results || []).sort((a, b) => b.vote_average - a.vote_average).slice(0, 5));
        else console.error("Failed to fetch featured:", featRes.reason);
        setLoadingStates(prev => ({ ...prev, featured: false }));

        if (trendRes.status === 'fulfilled') setTrendingMoviesState((trendRes.value.results || []).slice(0, 12));
        else console.error("Failed to fetch trending:", trendRes.reason);
        setLoadingStates(prev => ({ ...prev, trending: false }));

        if (popRes.status === 'fulfilled') setPopularMoviesListState((popRes.value.results || []).slice(0, 12));
        else console.error("Failed to fetch popular:", popRes.reason);
        setLoadingStates(prev => ({ ...prev, popular: false }));

        if (topRes.status === 'fulfilled') setTopRatedMoviesListState((topRes.value.results || []).slice(0, 12));
        else console.error("Failed to fetch topRated:", topRes.reason);
        setLoadingStates(prev => ({ ...prev, topRated: false }));

        if (upcRes.status === 'fulfilled') setNewReleasesState((upcRes.value.results || []).sort((a,b) => new Date(b.release_date) - new Date(a.release_date)).slice(0, 12));
        else console.error("Failed to fetch newReleases:", upcRes.reason);
        setLoadingStates(prev => ({ ...prev, newReleases: false }));

        if ([featRes, trendRes, popRes, topRes, upcRes].some(r => r.status === 'rejected')) {
            setInitialDataError("Some movie sections could not be loaded.");
        }

      } catch (err) {
        console.error("Critical error fetching initial app data:", err);
        setInitialDataError("Could not load essential app data.");
        setLoadingStates({ featured: false, trending: false, popular: false, topRated: false, newReleases: false });
      }
    };
    fetchInitialAppData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount


  // --- Favorites Functions ---
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
  const isFavorite = useCallback((movieId) => favorites.some(fav => fav.id === movieId), [favorites]);


  // --- Search Functions (Updated for Pagination) ---
  const performSearch = useCallback(async (query, page = 1, filters = {}, append = false) => {
    if (!query || !query.trim()) {
      setSearchResults([]);
      setSearchError(null);
      setSearchQueryState('');
      setSearchCurrentPage(1);
      setSearchTotalPages(1);
      return;
    }
    setIsSearching(true);
    setSearchError(null);
    if (!append) setSearchQueryState(query.trim()); // Update query only if it's a new search

    try {
      await getApiConfig();
      const data = await searchMoviesApi(query.trim(), page, filters);
      if (append) {
        setSearchResults(prevResults => [...prevResults, ...(data.results || [])]);
      } else {
        setSearchResults(data.results || []);
      }
      setSearchCurrentPage(data.page || 1);
      setSearchTotalPages(data.total_pages || 1);

      if (!data.results || data.results.length === 0) {
        if (!append) setSearchError(`No results found for "${query.trim()}".`);
        // If appending and no more results, don't show error, just stop
      }
    } catch (err) {
      console.error("Error searching movies:", err);
      setSearchError("Failed to fetch search results. Please try again.");
      if (!append) setSearchResults([]); // Clear results only on new search error
    } finally {
      setIsSearching(false);
    }
  }, []); // Removed dependencies that might cause loops, page/filters/append are direct args

  const updateSearchQuery = useCallback((query) => { setSearchQueryState(query); }, []);


  // --- "All Movies" Page Functions (NEW) ---
  const fetchOrLoadMoreAllMovies = useCallback(async (sortBy = currentAllMoviesSortBy, filters = {}, reset = false) => {
    if (isLoadingMoreAllMovies && !reset) return;

    const pageToFetch = reset ? 1 : allMoviesCurrentPage + 1;

    if (!reset && pageToFetch > allMoviesTotalPages && allMoviesTotalPages !== 0 && allMoviesTotalPages !== 1) {
        setAllMoviesError(null);
        setIsLoadingMoreAllMovies(false);
        return;
    }

    if(reset) setAllMovies([]); // Clear existing movies for a new sort/filter
    setIsLoadingMoreAllMovies(true);
    setAllMoviesError(null);

    try {
      const data = await discoverAllMoviesApi(pageToFetch, sortBy, filters);
      if (reset) {
        setAllMovies(data.results || []);
      } else {
        setAllMovies(prev => [...prev, ...(data.results || [])]);
      }
      setAllMoviesCurrentPage(data.page || 1);
      setAllMoviesTotalPages(data.total_pages || 1);
      setCurrentAllMoviesSortBy(sortBy); // Update the sort order in context
    } catch (err) {
      console.error("Error fetching 'all movies':", err);
      setAllMoviesError("Could not load more movies. Please try again.");
    } finally {
      setIsLoadingMoreAllMovies(false);
    }
  }, [allMoviesCurrentPage, allMoviesTotalPages, isLoadingMoreAllMovies, currentAllMoviesSortBy]);


  const value = {
    favorites, toggleFavorite, isFavorite,
    featuredMovies, trendingMovies, popularMovies: popularMoviesList, topRatedMovies: topRatedMoviesList, newReleases,
    loadingStates, initialDataError,
    lastSearch, setLastSearch,

    searchResults, searchQuery, setSearchQuery: updateSearchQuery, performSearch, isSearching, searchError,
    searchCurrentPage, searchTotalPages, // Expose for pagination

    // Values for "All Movies" Page
    allMovies,
    allMoviesCurrentPage,
    allMoviesTotalPages,
    isLoadingMoreAllMovies,
    allMoviesError,
    fetchOrLoadMoreAllMovies,
    currentAllMoviesSortBy,
    availableGenres,
  };

  return (
    <MovieDataContext.Provider value={value}>
      {children}
    </MovieDataContext.Provider>
  );
};