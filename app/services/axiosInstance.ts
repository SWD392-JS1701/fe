import axios from "axios";
import { API_URL } from "@/config";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.config.url !== "/auth/login") {
      localStorage.removeItem("access_token");

      if (typeof window !== "undefined") {
        window.location.href = "/sign-in";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
