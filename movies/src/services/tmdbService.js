// src/services/tmdbService.js
import axios from 'axios';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// --- This part is crucial for getImageUrl ---
let apiConfig = null;
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/'; // You can use this directly if you don't fetch full config

export const getApiConfig = async () => { // Renamed from getApiConfiguration for consistency if you prefer
  if (apiConfig) {
    return apiConfig;
  }
  try {
    const response = await axios.get(`${BASE_URL}/configuration?api_key=${API_KEY}`);
    apiConfig = response.data.images;
    return apiConfig;
  } catch (error) {
    console.error('Error fetching API configuration:', error);
    throw error;
  }
};

export const getImageUrl = (path, size = 'w500') => {
  // Ensure config is fetched or use a default base URL
  const baseUrlToUse = apiConfig?.secure_base_url || apiConfig?.base_url || IMAGE_BASE_URL;

  if (!path) {
    // Construct placeholder dimensions based on common aspect ratios or fixed size
    const width = parseInt(size.substring(1)) || 300;
    const height = Math.round(width * 1.5); // Assuming 2:3 aspect ratio for posters
    return `https://via.placeholder.com/${width}x${height}?text=No+Image`;
  }
  // Make sure to await getApiConfig() if apiConfig might be null on first call
  // This simple version assumes apiConfig might be populated or uses a fallback.
  // A more robust getImageUrl might need to be async if it ensures config is loaded.
  return `${baseUrlToUse}${size}${path}`;
};
// --- End of crucial part for getImageUrl ---


export const getTrendingMovies = async (timeWindow = 'day', page = 1) => {
  try {
    if (!apiConfig) await getApiConfig(); // Ensure config is loaded
    const response = await axios.get(`${BASE_URL}/trending/movie/${timeWindow}?api_key=${API_KEY}&page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    throw error;
  }
};

// Function to search for movies
export const searchMovies = async (query, page = 1, filters = {}) => { // Added filters parameter
    try {
      if (!apiConfig) {
        await getApiConfig();
      }
      const params = {
        api_key: API_KEY,
        query: query,
        page: page,
        include_adult: false, // As per project spec (usually false)
        // Add filter parameters if your API supports them directly
        // Example for year (if API supports it, check TMDb docs):
        // if (filters.year) params.primary_release_year = filters.year;
        // Example for genre (TMDb uses 'with_genres' and expects genre IDs):
        // if (filters.genre) params.with_genres = filters.genre; // This would need genre ID
        // Rating filters are usually client-side or more complex API calls
      };
  
      // Remove undefined filter params to keep the URL clean
      // Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);
      // The above is not strictly necessary as undefined params are usually ignored by axios
  
      console.log('Searching with params:', params); // For debugging
  
      const response = await axios.get(`${BASE_URL}/search/movie`, { params });
      return response.data; // { page, results, total_pages, total_results }
    } catch (error) {
      console.error(`Error searching movies for query "${query}":`, error);
      throw error;
    }
  };

  
  
// Function to get movie details (ensure it includes videos if needed elsewhere)
export const getMovieDetails = async (movieId) => {
    try {
      if (!apiConfig) await getApiConfig();
      const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
        params: {
          api_key: API_KEY,
          append_to_response: 'credits,videos,images,recommendations,similar' // Include videos here!
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching details for movie ${movieId}:`, error);
      throw error;
    }
  };
  
  
  // OR, a dedicated function just for videos:
  export const getMovieVideos = async (movieId) => {
      try {
          const response = await axios.get(`${BASE_URL}/movie/${movieId}/videos`, {
              params: { api_key: API_KEY }
          });
          return response.data.results || []; // Return the results array directly
      } catch (error) {
          console.error(`Error fetching videos for movie ${movieId}:`, error);
          // Return empty array on error or re-throw
          return [];
      }
  };
  
  // Helper to find the official YouTube trailer key
  export const findTrailerKey = (videos) => {
      if (!videos || videos.length === 0) {
          return null;
      }
      // Prioritize official trailers on YouTube
      const officialTrailer = videos.find(
          (video) => video.site === 'YouTube' && video.type === 'Trailer' && video.official === true
      );
      if (officialTrailer) {
          return officialTrailer.key;
      }
      // Fallback to any trailer on YouTube
      const anyTrailer = videos.find(
          (video) => video.site === 'YouTube' && video.type === 'Trailer'
      );
      if (anyTrailer) {
          return anyTrailer.key;
      }
      // Fallback to any teaser on YouTube
      const anyTeaser = videos.find(
          (video) => video.site === 'YouTube' && video.type === 'Teaser'
      );
       if (anyTeaser) {
          return anyTeaser.key;
      }
      // Fallback to first youtube video if no trailers/teasers
       const firstYouTubeVideo = videos.find((video) => video.site === 'YouTube');
       if (firstYouTubeVideo) {
          return firstYouTubeVideo.key;
      }
  
      return null; // No suitable video found
  };
  

// ... other functions like searchMovies, getMovieDetails ...