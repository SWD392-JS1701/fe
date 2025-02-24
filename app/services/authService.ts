import { API_URL } from "@/config";
import axios from "axios";

export const register = async (
  username: string,
  email: string,
  plainPassword: string,
  first_name: string,
  last_name: string,
  phone_number: string,
  address: string,
  role?: string
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
      role,
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

export const fetchProfile = async () => {
  try {
   
    const storedToken = localStorage.getItem("access_token");
    if (!storedToken) throw new Error("No token found");

    const token = JSON.parse(storedToken)?.access_token;
    if (!token) throw new Error("Invalid token format");
    
    
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: "GET",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });

    if (!response.ok) throw new Error("Failed to fetch profile");

    const userProfile = await response.json();
    
    return userProfile; 
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    return null;
  }
};
