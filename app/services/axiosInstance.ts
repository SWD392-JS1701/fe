import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';
import { API_URL } from '@/config';
import { toast } from "react-hot-toast";



// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Request interceptor - adds token to requests
axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.user?.access_token) {
      config.headers.Authorization = `Bearer ${session.user.access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handles auth errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If we get a 401 or 403 and haven't retried yet
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get a fresh session - NextAuth will handle token refresh if needed
        const newSession = await getSession();
        
        if (newSession?.user?.access_token) {
          // Update the failed request with new token and retry
          originalRequest.headers.Authorization = `Bearer ${newSession.user.access_token}`;
          return axiosInstance(originalRequest);
        } else {
          // If no new session/token, sign out
          await signOut({ redirect: true, callbackUrl: '/sign-in' });
          toast.error("Your session has expired. Please sign in again.");
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // If anything goes wrong, sign out
        await signOut({ redirect: true, callbackUrl: '/sign-in' });
        toast.error("Your session has expired. Please sign in again.");
        return Promise.reject(refreshError);
      }
    }

    // Handle other error statuses
    switch (error.response?.status) {
      case 400:
        toast.error("Invalid request. Please check your data.");
        break;
      case 403:
        toast.error("You don't have permission to perform this action.");
        break;
      case 404:
        toast.error("Resource not found.");
        break;
      case 422:
        const validationErrors = error.response.data?.errors;
        if (validationErrors) {
          Object.values(validationErrors).forEach((message) => {
            if (typeof message === 'string') {
              toast.error(message);
            }
          });
        }
        break;
      case 500:
        toast.error("Server error. Please try again later.");
        break;
      default:
        if (!error.response) {
          toast.error("Network error. Please check your connection.");
        } else {
          toast.error(error.response.data?.message || "An unexpected error occurred.");
        }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
