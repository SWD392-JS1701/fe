import { API_URL } from "@/config";
import axios from "axios";

export const register = async (
  username: string,
  email: string,
  plainPassword: string,
  first_name: string,
  last_name: string,
  phone_number: string,
  address: string
) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      username,
      email,
      plainPassword,
      first_name,
      last_name,
      phone_number,
      address,
    });

    return response.data;
  } catch (error: any) {
    console.error("Register API Error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to register. Please try again."
    );
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    const data = response.data;
    localStorage.setItem("access_token", data.access_token); // Save access_token to localStorage
    return data;
  } catch (error: any) {
    console.error("Login API Error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch. Please try again."
    );
  }
};
