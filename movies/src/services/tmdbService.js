// src/services/tmdbService.js
import axios from "axios";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

let apiConfig = null;
let genreMapCache = null; // Cache for genre ID -> name mapping
export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";

export const getApiConfig = async () => {
  if (apiConfig) {
    return apiConfig;
  }
  try {
    console.log("Fetching TMDb API configuration...");
    const response = await axios.get(`${BASE_URL}/configuration`, {
      params: { api_key: API_KEY },
    });
    apiConfig = response.data.images;
    console.log("API Config fetched:", apiConfig);
    return apiConfig;
  } catch (error) {
    console.error("Error fetching API configuration:", error);
    throw error;
  }
};

export const getMovieGenres = async () => {
  if (genreMapCache) return genreMapCache;
  try {
    console.log("Fetching movie genres...");
    const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
      params: { api_key: API_KEY, language: "en-US" },
    });
    // Create a map for easy lookup: { GenreId: GenreName, ... }
    // And also an array of objects {id, name} for dropdowns
    const genresArray = response.data.genres || [];
    genreMapCache = {
      map: genresArray.reduce((acc, genre) => {
        acc[genre.id] = genre.name;
        return acc;
      }, {}),
      list: genresArray,
    };
 console.log('Fetched Genres:', genreMapCache); 
    return genreMapCache;
  } catch (error) {
    console.error("Error fetching movie genres:", error);
    return { map: {}, list: [] }; 
  }
};

export const getImageUrl = (path, size = "w500") => {
  const baseUrlToUse =
    apiConfig?.secure_base_url || apiConfig?.base_url || IMAGE_BASE_URL;
  if (!path) {
    const widthMatch = size.match(/w(\d+)/);
    const width = widthMatch ? parseInt(widthMatch[1], 10) : 300;
    const height = Math.round(width * 1.5);
    return `https://via.placeholder.com/${width}x${height}?text=No+Image`;
  }
  return `${baseUrlToUse}${size}${path}`;
};

export const getTrendingMovies = async (timeWindow = "day", page = 1) => {
  try {
    if (!apiConfig) await getApiConfig();
    const response = await axios.get(
      `${BASE_URL}/trending/movie/${timeWindow}`,
      { params: { api_key: API_KEY, page, language: "en-US" } }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching trending movies:`, error);
    throw error;
  }
};

export const searchMovies = async (query, page = 1, filters = {}) => {
  try {
    if (!apiConfig) await getApiConfig();
    const params = {
      api_key: API_KEY,
      query: query,
      page: page,
      include_adult: false,
      language: "en-US",
      ...(filters.year && { primary_release_year: filters.year }),
    };
    console.log("Searching movies with params:", params);
    const response = await axios.get(`${BASE_URL}/search/movie`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error searching movies for query "${query}":`, error);
    throw error;
  }
};

export const getMovieDetails = async (movieId) => {
  try {
    if (!apiConfig) await getApiConfig();
    const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: API_KEY,
        language: "en-US",
        append_to_response:
          "credits,videos,images,release_dates,similar,recommendations",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for movie ${movieId}:`, error);
    throw error;
  }
};

export const getMovieVideos = async (movieId) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/videos`, {
      params: { api_key: API_KEY, language: "en-US" },
    });
    return response.data.results || [];
  } catch (error) {
    console.error(`Error fetching videos for movie ${movieId}:`, error);
    return [];
  }
};

export const findTrailerKey = (videos) => {
  /* ... (same as before, no changes needed here) ... */
  if (!videos || videos.length === 0) return null;
  const trailer =
    videos.find(
      (v) => v.site === "YouTube" && v.type === "Trailer" && v.official
    ) ||
    videos.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
    videos.find((v) => v.site === "YouTube" && v.type === "Teaser") ||
    videos.find((v) => v.site === "YouTube");
  return trailer ? trailer.key : null;
};

export const getPopularMovies = async (page = 1) => {
  try {
    if (!apiConfig) await getApiConfig();
    const response = await axios.get(`${BASE_URL}/movie/popular`, {
      params: { api_key: API_KEY, page, language: "en-US" },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching popular movies:`, error);
    throw error;
  }
};

export const getTopRatedMovies = async (page = 1) => {
  try {
    if (!apiConfig) await getApiConfig();
    const response = await axios.get(`${BASE_URL}/movie/top_rated`, {
      params: { api_key: API_KEY, page, language: "en-US" },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching top rated movies:`, error);
    throw error;
  }
};

export const getUpcomingMovies = async (page = 1) => {
  try {
    if (!apiConfig) await getApiConfig();
    const response = await axios.get(`${BASE_URL}/movie/upcoming`, {
      params: { api_key: API_KEY, page, language: "en-US" },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching upcoming movies:`, error);
    throw error;
  }
};

// --- Function for the "All Movies" Page (Discover Endpoint) ---
export const discoverAllMovies = async (
  page = 1,
  sortBy = "popularity.desc",
  filters = {}
) => {
  try {
    if (!apiConfig) await getApiConfig();
    // if (!genreMapCache && filters.with_genres) await getMovieGenres(); // Ensure genres are loaded if filtering by ID

    const params = {
      api_key: API_KEY,
      page: page,
      sort_by: sortBy,
      include_adult: false,
      include_video: false,
      language: "en-US",
      // Spread filter parameters that are valid for the /discover/movie endpoint
      ...(filters.primary_release_year && {
        primary_release_year: filters.primary_release_year,
      }),
      ...(filters.with_genres && { with_genres: filters.with_genres }), // Expects comma-separated genre IDs
      ...(filters["vote_average.gte"] && {
        "vote_average.gte": filters["vote_average.gte"],
      }),
    };

    // Remove any filter properties with undefined or empty values to keep URL clean
    Object.keys(params).forEach(
      (key) =>
        (params[key] === undefined || params[key] === "") && delete params[key]
    );

    console.log(`Discovering All Movies with params:`, params);
    const response = await axios.get(`${BASE_URL}/discover/movie`, { params });
    return response.data; // { page, results, total_pages, total_results }
  } catch (error) {
    console.error(
      `Error discovering movies with sort ${sortBy}, filters ${JSON.stringify(
        filters
      )}:`,
      error
    );
    throw error;
  }
};
