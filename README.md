# Cine City – Discover Your Favorite Films

Cine City is a dynamic web application designed for movie enthusiasts. Built with React and Material-UI, it allows users to seamlessly search for movies, delve into detailed information, discover currently trending films, and curate a personal list of favorites. The application leverages real-time data from The Movie Database (TMDb) API and features secure user authentication powered by Clerk.

This project was developed as part of an internship assignment, showcasing modern web development practices.

**Live Demo:** [Link to Deployed Application](https://cinecity.vercel.app/)
**GitLab Repository:** [Link to GitLab Repository](https://github.com/Kaju2002/movie_App)


## Features Implemented

**Core Functionality:**

*   **User Authentication & Management (via Clerk):**
    *   Secure user sign-up and sign-in functionality.
    *   Session management handled by Clerk, persisting login state across sessions.
    *   Navbar dynamically displays "Login" or a user avatar with a dropdown menu (Profile, Logout).
    *   Dedicated routes for `/sign-in`, `/sign-up`, and `/user-profile` leveraging Clerk's pre-built UI.
    *   Protected routes for features like "Favorites," accessible only to authenticated users.
*   **Movie Discovery & Search:**
    *   Responsive Navbar with an integrated search bar for finding movies by title.
    *   Dedicated Search Results Page (`/search?query=...`) displaying matching movies in a grid.
*   **Movie Information Display:**
    *   Detailed Movie Page (`/movie/:id`) showcasing:
        *   Backdrop and poster images.
        *   Title, release year, TMDb rating, vote count.
        *   Runtime, release date, genres (as interactive Chips).
        *   Plot overview, director(s), and writer(s).
        *   Key statistics (Release Date, Runtime, Genre, Awards placeholder).
        *   `CastList` component with actor avatars, names, and character roles.
        *   `Carousel` for Similar/Recommended movies.
*   **Homepage Content:**
    *   Dynamic `HeroSlider` featuring prominent movies with details and actions.
    *   Multiple `Carousel` sections for "Featured Today," "Trending," "Top Rated," and "New Releases," populated by distinctOkay, this API calls.
*   **Favorites Management:**
    *   Users can add or remove movies from their personal " is the final stretch! You want to integrate the Clerk authentication details into your already well-structured `README.md`.

Here's the complete `README.md` with the Clerk information properlyFavorites" list.
    *   This action is restricted to logged-in users; non-authenticated users are prompted to log incorporated into the relevant sections. I've made sure to adjust the "Features Implemented" to reflect that login is now handled by Clerk in via a Snackbar.
    *   Favorites are stored locally in the browser's `localStorage`.
    *   Dedicated Favorites Page (`/favorites`) displays all saved movies.
*   **User Experience:**
    *   **Light/Dark Mode:** Application-wide theme toggling with `localStorage` persistence.
    *   **Responsive Design:** UI, and updated "Technologies Used," "Setup," "API Usage," and "Deployment."


# Cine City – Discover Your Favorite Films

A web application built with React and Material-UI that allows users to search for movies, view detailed information, discover trending films, and manage a list of favorites. User authentication and management are handled by **Clerk**. The app fetches real-time data from the TMDb (The Movie Database) API.


**Live Demo:** [YOUR_DEPLOYED_LINK_HERE](https://cinecity.vercel.app/)  
    *   **Loading & Error States:** Skeletons, spinners, and user-friendly `Alert`/`Snackbar` messages are used to indicate loading or API errors.
    *   **Smooth Animations & Transitions:** Subtle animations on components like the Navbar title, HeroSlider, and content entry on pages enhance the user experience.

**API Integration:**

*   Utilizes **The Movie Database (TMDb) deploted in versel

**Repository:** [YOUR_GITLAB_REPO_LINK](https://github.com/Kaju2002/movie_App) 


## Features Implemented

**User Interface (UI):**

*   [x] **User Authentication & Management (via Clerk):**
    *   Secure user sign-up and sign-in functionality powered by **Clerk**.
    *   Handles user sessions, password management (reset, etc.), and can be configured for social logins via the Clerk Dashboard.
    *   Navbar dynamically displays "Login" or a User Avatar with a dropdown menu (Profile, Logout) based on Clerk's authentication status.
    *   Dedicated routes (`/sign-in`, `/sign-up`, `/user-profile`) render Clerk movie-related data (fetched lists, search state, favorites, last search, loading/error states).
    *   `ThemeContext`: Manages the current theme (light/dark) and toggle functionality.
*   **Clerk SDK:** Handles user authentication state, session information, and provides user data through hooks.

**Extra Features Implemented:**

*   's pre-built UI components for a seamless authentication experience.
*   [x] **Protected Routes:** Features like "Favorites" and "User Profile" are accessible only to authenticated users, managed via Clerk's authentication state.
*   [x] **Navbar:** Responsive navigation bar with animated "Cine City" Logo, Search Input, Desktop Links (Home, Movies, Favorites - conditional), Mobile Drawer Menu, and Theme Toggle. Features a glassmorphism effect.
*   [x] **Footer:** Custom, responsive footer displaying app information, links, and copyright.
*   [x] **Homepage (`/`)**:
    *   Displays[x] **Show YouTube Trailers:** Fetches video data from TMDb and displays the relevant YouTube trailer in a responsive `TrailerModal`.
*   [ ] **Filters (Genre, Year, Rating) on Search Page:** UI elements for filtering are present. Year filtering via API is partially set up. Full implementation of genre and rating filters (e.g., using TMDb's `/discover/movie` endpoint or client-side logic) is a potential future enhancement.
*   [x] **"Load More" Button for "All Movies" Page:** Implemented for paginating through a large list of movies on the dedicated `/movies` page. _(Note: Infinite scrolling for the main search results page is listed as a core requirement and might be pending)._

## Technologies Used

*   **React (v18+):** JavaScript library for building user interfaces.
*   **Material-UI (MUI) v5:** Comprehensive React UI component library for styling and layout.
*   **Clerk:** For complete user authentication, session management, and pre-built UI components. (` a dynamic `HeroSlider` featuring highly-rated movies with backdrop images, titles, ratings, and buttons for Trailer/More Info. Includes auto-advance, arrows, and dot navigation.
    *   Multiple `Carousel` sections (e.g., "Featured Today", "Trending", "Top Rated", "New Releases") displaying movies fetched from the API.
*   [x] **All Movies Page (`/movies`)**:
    *   Displays a browsable list of movies (e.g., discovered by popularity) with sorting options.
    *   Implements a "Load More" button for pagination.
*   [x] **Movie Details Page (`/movie/:id`)**:
    *   Displays detailed movie information (backdrop, poster, title, year, rating, overview, credits, stats, etc.).
    *   Includes `CastList`, photo gallery (`ImageList`), and similar movies `Carousel`.
    *   Provides "Watch Trailer" (opens YouTube trailer in a Modal) and "Add to Favorites" functionality (requires login for favoriting).
    *   Features a floating mobile action bar for key actions.
*   [x] **Search Results Page (`/search?query=...`)**:
    *   Displays search results in a grid.@clerk/clerk-react`)
*   **React Router DOM v6:** For client-side routing and navigation.
*   **Axios:** Promise-based HTTP client for API requests.
*   **TMDb API (v3):** For sourcing all movie-related data.
*   **React Context API:** For global state management.
*   **JavaScript (ES6+):** Core programming language.
*   **CSS / SX Prop (MUI):** For custom styling and theming.
*   **Vercel :**  For deployment.

## Project Structure


## Setup and Installation

1.  **Prerequisites:**
    *   Node.js (v16 or later recommended)

2.  **Clone the repository:**
    git clone YOUR_GITLAB_REPO_LINK
    cd cine-city # Or your project's directory name
    ```
3.  **Install dependencies:**
    ```bash
    npm install
  
4.  **Set up Environment Variables:**
    *   Create a file named `.env` in the root of the project directory.
    *   Add your API keys:
        ```env
        REACT_APP_TMDB_API_KEY=YOUR_TMDB_API_KEY_HERE
        REACT_APP_CLERK_PUBLISHABLE_KEY=YOUR_CLERK_PUBLISHABLE_KEY_HERE
        ```
        *(If using Vite, prefix with `VITE_` e.g., `VITE_TMDB_API_KEY`)*
    *   Obtain your TMDb API key from [The Movie Database](https://www.themoviedb.org/settings/api).
    *   Obtain your Clerk Publishable Key from your [Clerk Dashboard](https://dashboard.clerk.com) (API Keys section).

5.  **Clerk Dashboard Configuration:**
    *   Create an application in your Clerk Dashboard.
    *   Configure **Paths** under your Clerk application settings:
        *   Sign-in URL: `/sign-in`
        *   Sign-up URL: `/sign-up`
        *   After sign-in URL: `/` (or your desired redirect)
        *   After sign-up URL: `/` (or your desired redirect)
        *   User Movie Genres.
*   [x] **"Load More" Button for Pagination:** Implemented on the "All Movies" page. _(Search results pagination is an area for future improvement - e.g., infinite scroll or load more)._
*   [x] **API Error Handling:** Implemented with user-friendly messages (e.g., Snackbars, Alerts) for key data fetching operations.

**State Management:**

*   [x] Uses **React Context API** (`MovieDataContext` for movie-related data, `ThemeContext` for theming).
*   [x] **Clerk** manages user authentication state, session information, and user profile data globally.
*   [x] Stores the user’s **last searched movie** in `localStorage`.
*   [x] Allows authenticated users to save **favorite movies** to a list stored in profile URL: `/user-profile`
    *   Enable desired **Authentication Providers** (e.g., Email/Password, Google, GitHub).

6.  **Run the application:**
    ```bash
    npm start
  
    
    The application will be available at `http://localhost:3000`.

## API Usage

*   **TMDb API:** All movie data (trending, popular, details, search, images, videos, credits, genres, etc.) is fetched from The Movie Database API v3.
*   **Clerk:** User authentication, session management, and user profile functionalities are handled via the `@clerk/clerk-react` SDK using hooks like `useUser()` and `useClerk()`.

## Key Components & Logic

*   **`MovieDataContext`:** Central hub for managing movie lists, search state, favorites, and API loading/error states.
*   **`ThemeContext`:** Manages light/dark mode toggling and theme persistence.
*   **`tmdbService.js`:** Contains all functions for interacting with the TMDb API.
*   **`Navbar.js`:** Handles site navigation, search input, theme toggle, and dynamic display based on user authentication status (Login button vs. User Profile menu via Clerk).
*   **`MoviePage.js`:** Fetches and displays comprehensive details for a single movie, including trailer modal and favorite functionality.
*   **`Movie `localStorage` (prompting login if not authenticated).

**Extra Features Implemented:**

*   [x] **Show YouTube Trailers:** Via `TrailerModal` and API calls.
*   [ ] **Filters (Genre, Year, Rating):** UI implemented. Year filter connected to API. Full Genre/Rating filtering logic is a potential future enhancement.
*   [x] **"Load More" Button:** Implemented for the `/movies` page.

## Technologies Used

*   **React:** (v18.x) JavaScript library for building user interfaces.
*   **Material-UI (MUI):** (v5.x) React UI component library for styling and layout.
*   **Clerk:** For complete user authentication, session management, and pre-built UI components for sign-in, sign-up, and user profiles.
*   **React Router DOM:** (v6.x) For client-side routing and navigation.
*   **Axios:** Promise-based HTTP client for making API requests.
*   **TMDb API:** The Movie Database API (v3) for sourcing movie data.
*   **React Context API:** For global state management.
*   **ESLint:** For code linting.
*   **Git & GitLab:** For version control and repository hosting.
*   **Netlify** For deployment.

## Setup and Installation

Follow these steps to set up the project locally:

1.  **Prerequisites:**
    *   Node.js (v16.x or later recommended)

2.  **Clone the repository:**
    git clone YOUR_GITLAB_REPO_LINK
    cd cine-city # Or your project directory name
    
3.  **Install dependencies:**
    npm install
 
4.  **Set up Environment Variables:**
    *   Create a file named `.env` in the root of the project directory.
    *   Add your TMDb API key (v3 auth) and Clerk Publishable Key:
        ```env
        REACT_APP_TMDB_API_KEY=YOUR_TMDB_API_KEY_HERE
        REACT_APP_CLERK_PUBLISHABLE_KEY=YOUR_CLERK_PUBLISHABLE_KEY_HERE
        ```
        *(If using Vite, prefix environment variables with `VITE_` instead of `REACT_APP_` and update access in `index.js` accordingly, e.g., `import.meta.env.VITE_CLERK_PUBLISHABLE_KEY`)*
    *   Replace placeholders with your actual keys.
        *   Get your TMDb API key from [The Movie Database](https://www.themoviedb.org/settings/api).
        *   Get your Clerk Publishable Key from your [Clerk Dashboard](https://dashboard.clerk.com) > Your Application > API Keys.

5.  **Card.js`:** A reusable component for displaying movie posters and basic info, with integrated theme-aware styling and conditional favorite action (requires login).
*   **Protected Routes (`ProtectedRoute.js`):** A wrapper component utilizing Clerk's `useUser` hook to restrict access to certain pages (like `/favorites`) to authenticated users only.

## Deployment

This application is deployed on **[Specify Vercel or Netlify]**.

**Live URL:** [https://cinecity.vercel.app/]

**Deployment Environment Variables:**
The following environment variables must be configured in the deployment service's settings:
*Clerk Dashboard Configuration:**
    *   Ensure you have an active application in your Clerk Dashboard.
    *   **Crucial:** Configure your instance settings in the Clerk Dashboard:
        *   **Paths:** Set the "Sign-in URL" to `/sign-in`, "Sign-up URL" to `/sign-up`.
        *   **Redirection:** Set "After sign-in URL" and "After sign-up URL" to `/` (or your desired landing page after login). Set "After sign-out URL" to `/`.
        *   **Enabled Providers:** Enable desired authentication methods (e.g., Email/Password, Google, GitHub).
    *   For development, ensure `http://localhost:3000` (or your dev port) is an allowed origin.

6.  **Run the application:**
    npm start
  
    The application should now be running on `http://localhost:3000`.

**Ulageeswaran Kajanthan**
**SLIIT **