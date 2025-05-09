// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; 
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// Import MUI components
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { MovieDataProvider } from "./context/MovieDataContext";
import { CustomThemeProvider } from "./context/ThemeContext";
import { ClerkProvider } from "@clerk/clerk-react";

const theme = createTheme({});

const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <ThemeProvider theme={theme}>
        <CssBaseline /> 
        <CustomThemeProvider>
          <MovieDataProvider>
            <App />
          </MovieDataProvider>
        </CustomThemeProvider>
      </ThemeProvider>
    </ClerkProvider>
  </React.StrictMode>
);

reportWebVitals();
