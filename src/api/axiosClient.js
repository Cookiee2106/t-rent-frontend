import axios from "axios";

let currentBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
if (currentBaseUrl.endsWith("/api")) {
  currentBaseUrl = currentBaseUrl.slice(0, -4);
}

const axiosClient = axios.create({
  baseURL: currentBaseUrl,
  timeout: 10000,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Add response interceptor to handle 401
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and user data
      localStorage.removeItem("accessToken");
      localStorage.removeItem("currentUser");
      
      // Optionally reload the page to kick user out to login screen
      // window.location.reload(); 
      // We will handle the redirect via state in App.jsx if possible, 
      // but reloading is a quick fail-safe for global 401.
    }
    return Promise.reject(error);
  }
);

export default axiosClient;