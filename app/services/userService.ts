import { jwtDecode } from "jwt-decode";

import axiosInstance from "./axiosInstance";
import { User } from "../types/user";
import { DecodedToken } from "../types/token";

const getAccessToken = (): string | null => {
  const storedToken = localStorage.getItem("access_token");
  if (!storedToken) return null;
  return storedToken;
};

const authHeaders = () => {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await axiosInstance.get<User[]>("/users", {
      headers: authHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const getUserById = async (): Promise<User | null> => {
  try {
    const accessToken = getAccessToken();

    if (!accessToken) {
      console.error("No access token found.");
      return null;
    }

    const decoded: DecodedToken = jwtDecode(accessToken);
    const userId = decoded.id;

    const response = await axiosInstance.get<User>(`/users/${userId}`, {
      headers: authHeaders(),
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
      response = await axiosInstance.get<User>(`/user/${query}`, {
        headers: authHeaders(),
      });
    } else {
      response = await axiosInstance.get<User>(`/users/${query}`, {
        headers: authHeaders(),
      });
    }
    return response.data;
  } catch (error) {
    console.error(`Error fetching user (${query}):`, error);
    return null;
  }
};

export const createUser = async (user: User): Promise<User | null> => {
  try {
    const response = await axiosInstance.post<User>("/users", user, {
      headers: authHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
};

export const updateUser = async (
  userId: string,
  user: Partial<User>
): Promise<User | null> => {
  try {
    const response = await axiosInstance.patch<User>(`/users/${userId}`, user, {
      headers: authHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/users/${userId}`, {
      headers: authHeaders(),
    });
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};
