import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/tailwind.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/Auth/auth.jsx";
import {LocationProvider} from "./components/Location/locationTrack.jsx"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <LocationProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
      </LocationProvider>
    </BrowserRouter>
  </React.StrictMode>
);
