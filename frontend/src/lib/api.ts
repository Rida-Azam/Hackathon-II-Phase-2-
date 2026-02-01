import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

console.log("[API] Configured baseURL:", API_URL);

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Track if we're already redirecting to prevent loops
let isRedirecting = false;

api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  // Log full constructed URL
  const fullUrl = `${config.baseURL}${config.url}`;
  console.log("[API] Full request URL:", fullUrl);
  console.log("[API] Request:", config.method?.toUpperCase(), config.url);
  console.log("[API] baseURL:", config.baseURL);
  console.log("[API] Token exists:", !!token);
  console.log("[API] Token value:", token ? `${token.substring(0, 20)}...` : "none");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log("[API] Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    // Log full error for debugging
    console.error("[API] Full error object:", error);
    console.error("[API] Error name:", error.name);
    console.error("[API] Error message:", error.message);

    // Handle different error types
    if (error.response) {
      // Server responded with error status
      console.error("[API] Response error:", error.response.status, error.response.data);

      if (error.response.status === 401 && typeof window !== "undefined" && !isRedirecting) {
        console.log("[API] 401 Unauthorized - clearing auth and redirecting to login");
        isRedirecting = true;
        localStorage.removeItem("auth_token");
        document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        window.location.href = "/login";
      }
    } else if (error.request) {
      // Request made but no response (network error, CORS, etc.)
      console.error("[API] Network error - no response received");
      console.error("[API] Request details:", error.request);
    } else {
      // Error in setting up request
      console.error("[API] Request setup error:", error.message);
    }

    return Promise.reject(error);
  }
);
