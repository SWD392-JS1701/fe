import axios from "axios";
import { API_URL } from "@/config";
import { jwtDecode } from "jwt-decode";

export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  point: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface DecodedToken {
  id: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
}

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get<User[]>(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const getUserById = async (): Promise<User | null> => {
  try {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      console.error("No access token found.");
      return null;
    }

    const decoded: DecodedToken = jwtDecode(accessToken);
    const userId = decoded.id;

    const response = await axios.get<User>(`${API_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
};

export const getUser = async (query: string): Promise<User | null> => {
  try {
    let response;
    if (query.includes("@")) {
      response = await axios.get<User>(`${API_URL}/user/${query}`);
    } else {
      response = await axios.get<User>(`${API_URL}/users/${query}`);
    }
    return response.data;
  } catch (error) {
    console.error(`Error fetching user (${query}):`, error);
    return null;
  }
};

export const createUser = async (user: User): Promise<User | null> => {
  try {
    const response = await axios.post<User>(`${API_URL}/users`, user);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
};

export const updateUser = async (
  userId: string,
  user: User
): Promise<User | null> => {
  try {
    const response = await axios.patch<User>(
      `${API_URL}/users/${userId}`,
      user
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/users/${userId}`);
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};
