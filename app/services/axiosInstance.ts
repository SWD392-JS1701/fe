import axios from "axios";
import { API_URL } from "@/config";
import { signOut, getSession } from "next-auth/react";
import { toast } from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.user?.access_token) {
      config.headers.Authorization = `Bearer ${session.user.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Don't redirect if it's the login endpoint
      if (originalRequest.url !== "/auth/login") {
        await signOut({ redirect: true, callbackUrl: "/sign-in" });
        toast.error("Session expired. Please sign in again.");
      }
      return Promise.reject(error);
    }
    // Handle 401 Forbidden errors
    if (error.response?.status === 403) {
      // Don't redirect if it's the login endpoint
      if (originalRequest.url !== "/auth/login") {
        await signOut({ redirect: true, callbackUrl: "/sign-in" });
        toast.error("Token expired. Please sign in again.");
      }
      return Promise.reject(error);
    }

    if (typeof window !== "undefined") {
      window.location.href = "/sign-in";
    }

    // Handle 403 Forbidden errors
    if (error.response?.status === 403) {
      toast.error("You don't have permission to perform this action");
      return Promise.reject(error);
    }

    // Handle 404 Not Found errors
    if (error.response?.status === 404) {
      toast.error("Resource not found");
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
