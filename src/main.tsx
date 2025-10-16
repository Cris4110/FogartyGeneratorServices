// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
//import { AuthProvider } from "../context/AuthContext";
//import { AuthContext } from "../../context/Appcontext";
import { AuthProvider } from "./context/Appcontext";


// Optional: custom MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#f50057",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* resets browser styles */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
