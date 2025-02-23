import { API_URL } from "@/config";

export const register = async (
  username: string,
  email: string,
  password: string,
  first_name: string,
  last_name: string,
  phone_number: string,
  address: string
) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify({
        username,
        email,
        password,
        first_name,
        last_name,
        phone_number,
        address,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data;
  } catch (error) {
    console.error("Register API Error:", error);
    throw new Error("Failed to register. Please try again.");
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`);
    }

    const data = await response.json();
    localStorage.setItem("access_token", JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Login API Error:", error);
    throw new Error("Failed to fetch. Please try again.");
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
