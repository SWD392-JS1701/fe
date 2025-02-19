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
    return data; // { access_token: "..." }
  } catch (error) {
    console.error("Login API Error:", error);
    throw new Error("Failed to fetch. Please try again.");
  }
};
