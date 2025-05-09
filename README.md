# Movie Explorer – Discover Your Favorite Films

A web application built with React and Material-UI that allows users to search for movies, view detailed information, discover trending films, and manage a list of favorites, all powered by the TMDb (The Movie Database) API.

This project was developed as part of the internship assignment requirements.

**Live Demo:** [Link to Deployed Site](YOUR_DEPLOYED_LINK_HERE)  *(Replace with your Vercel/Netlify link)*

**Repository:** [Link to GitLab Repository](YOUR_GITLAB_REPO_LINK) *(Replace with your GitLab link)*





## Features Implemented

**User Interface (UI):**

*   [x] **Navbar:** Responsive navigation bar with Logo, Search Input, Desktop Links (Home, Favorites, Login), Mobile Drawer Menu, and Theme Toggle. Features a glassmorphism effect when scrolled to the top.
*   [x] **Footer:** Custom, fixed footer displaying copyright, attribution, and optional social/navigation links.
*   [x] **Homepage (`/`)**:
    *   Displays a dynamic `HeroSlider` featuring highly-rated movies with backdrop images, titles, ratings, and buttons for Trailer/More Info. Includes auto-advance, arrows, and dot navigation.
    *   Multiple `Carousel` sections (e.g., "Featured Today", "Trending", "Top Rated", "New Releases") displaying movies fetched from the API.
*   [x] **Movie Details Page (`/movie/:id`)**:
    *   Displays detailed movie information fetched from TMDb based on URL ID.
    *   Includes backdrop image, poster, title, year, rating, vote count, runtime, release date, genres (as Chips), and overview.
    *   Shows Director and Writer information.
    *   Displays key stats (Release Date, Runtime, Genre, Awards placeholder) in styled blocks.
    *   Includes a `CastList` component with actor avatars, names, and character names.
    *   Includes sections for Photos (using `ImageList`) and Similar/Recommended Movies (using `Carousel`).
    *   Provides "Watch Trailer" button (opens YouTube trailer in a Modal) and "Add to Favorites" button.
    *   Features a floating mobile action bar for key actions on smaller screens.
*   [x] **Search Results Page (`/search?query=...`)**:
    *   Displays search results in a grid based on the query parameter from the URL.
    *   Includes a prominent search bar to refine or perform new searches.
    *   Shows the number of results found.
    *   Includes UI for Filters (Year, Genre, Rating) with Apply/Reset buttons (Filtering logic partially implemented - Year via API, others pending).
    *   Handles empty search state and "no results found" state.
*   [x] **Favorites Page (`/favorites`)**:
    *   Displays movies saved by the user to their favorites list.
    *   Shows the count of favorite movies and includes UI for sorting (sorting logic basic).
    *   Allows users to remove movies directly from this page.
    *   Displays an informative message and link when the list is empty.
*   [x] **Login Page (`/login`)**:
    *   Provides a basic UI with Username and Password fields and a Sign In button. (Note: Full authentication logic is not implemented).
*   [x] **Movie Card Component:** Reusable card displaying poster, title, year, rating. Includes hover effects (scale, overlay, title color change) and an integrated Add/Remove Favorites button. Theme-aware.
*   [x] **Carousel Component:** Reusable horizontal scrolling component with smooth scroll buttons (desktop) for displaying lists of `MovieCard`s.
*   [x] **Trailer Modal:** Reusable modal component (`Dialog`) to display YouTube trailers using an iframe.
*   [x] **Light/Dark Mode:** Theme toggle implemented using React Context API and `localStorage` persistence. Components use theme-aware styling (colors, backgrounds).
*   [x] **Responsiveness:** Layout and components adapt to different screen sizes using MUI's responsive features (Grid, Stack, `sx` prop breakpoints). Mobile-first principles considered.

**API Integration:**

*   [x] Uses **TMDb API v3** for all movie data.
*   [x] Uses **axios** for making API requests.
*   [x] Fetches **Trending Movies** (for Homepage carousels).
*   [x] Fetches **Movie Search Results**.
*   [x] Fetches **Detailed Movie Information** (`getMovieDetails` including `credits`, `videos`, `images`, `release_dates`, `similar`, `recommendations`).
*   [x] Fetches **Movie Videos** to find trailer keys.
*   [ ] **Infinite Scrolling / Load More:** _(Not Implemented - Requires pagination logic for search results)_
*   [x] **Basic API Error Handling:** `try...catch` blocks are used in API service functions. Basic error messages are displayed on relevant pages (e.g., MoviePage, HomePage). _(Further refinement recommended)_

**State Management:**

*   [x] Uses **React Context API** (`MovieDataContext`) for managing:
    *   Fetched movie lists (trending, popular, etc.) and their loading states.
    *   Search results, current search query, and searching status/errors.
    *   User's favorite movies list.
    *   User's last searched term.
*   [x] Stores **Last Searched Movie** in `localStorage` for persistence.
*   [x] Stores **Favorite Movies List** in `localStorage` for persistence.

**Extra Features Implemented:**

*   [x] **Show YouTube Trailers:** Implemented via `TrailerModal` and API calls.
*   [ ] **Filters (Genre, Year, Rating):** UI implemented, Year filter passed to API (if using `/search/movie`). Full Genre/Rating filtering logic requires further implementation (client-side or `/discover/movie` API).
*   [ ] **Load More Button:** _(Not Implemented)_


## Technologies Used

*   **React:** JavaScript library for building user interfaces.
*   **Material-UI (MUI):** React UI component library for styling and layout.
*   **React Router:** For client-side routing and navigation.
*   **Axios:** Promise-based HTTP client for making API requests.
*   **TMDb API:** The Movie Database API (v3) for sourcing movie data.
*   **React Context API:** For global state management (Theme, Movie Data).
*   **CSS / SX Prop:** For custom styling within MUI.
*   **Vercel / Netlify:** (Specify which one you used) For deployment.


## Setup and Installation

Follow these steps to set up the project locally:

1.  **Clone the repository:**
    ```bash
    git clone YOUR_GITLAB_REPO_LINK
    cd movie-explorer # Or your project directory name
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Set up Environment Variables:**
    *   Create a file named `.env` in the root of the project directory.
    *   Add your TMDb API key (v3 auth) to the `.env` file:
        ```
        REACT_APP_TMDB_API_KEY=YOUR_TMDB_API_KEY_HERE
        ```
    *   Replace `YOUR_TMDB_API_KEY_HERE` with your actual key obtained from [The Movie Database](https://www.themoviedb.org/settings/api).
    *   **Important:** The `.env` file is included in `.gitignore` and should *not* be committed to the repository.

4.  **Run the application:**
    ```bash
    npm start
    # or
    yarn start
    ```
    The application should now be running on `http://localhost:3000`.


## API Usage

This application relies heavily on [The Movie Database (TMDb) API v3](https://developers.themoviedb.org/3/getting-started/introduction). An API key is required to fetch data.

Key endpoints used:
*   `/configuration` (For image base URLs and sizes)
*   `/trending/movie/{time_window}`
*   `/search/movie`
*   `/movie/{movie_id}` (with `append_to_response` for details, credits, videos, etc.)
*   `/movie/{movie_id}/videos` (As fallback or alternative)
*   `/genre/movie/list` (Needed for genre ID mapping if implementing advanced genre filtering)
*   *(Potentially others like `/movie/popular`, `/movie/top_rated`, `/movie/upcoming`)*


## Deployment

This application is deployed on [Vercel / Netlify](YOUR_DEPLOYED_LINK_HERE) *(Choose one and link)*.

*(Briefly mention any specific environment variables needed for deployment if different from local, e.g., `REACT_APP_TMDB_API_KEY` must be set in the deployment service's settings).*


## Future Improvements / Known Issues

*   Implement full user authentication logic.
*   Implement pagination for search results (Infinite Scrolling or Load More).
*   Implement robust Genre and Rating filtering (likely using `/discover/movie` API or client-side).
*   Enhance API error handling with more specific user feedback (e.g., using Snackbars).
*   Add unit/integration tests.
*   Refine mobile responsiveness further based on testing.
*   Implement actual "Rate Movie" functionality.


## Contact

*(Your Name)* - *(Your Email or Portfolio Link - Optional)*

---