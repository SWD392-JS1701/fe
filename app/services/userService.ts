import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/config";
import { getSession, useSession } from "next-auth/react";
import { jwtDecode } from "jwt-decode";
import { User } from "../types/user";
import axiosInstance from "./axiosInstance";
interface JWTPayload {
  id: string;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const useAuthRedirect = () => {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/sign-in");
    } else {
      setIsChecking(false);
    }
  }, [session, status, router]);

  return { isChecking };
};

export const useCurrentUser = () => {
  const { data: session } = useSession();
  return session?.user;
};

const authHeaders = async (session?: any) => {
  if (!session) {
    session = await getSession();
  }
  return session?.user?.access_token
    ? { Authorization: `Bearer ${session.user.access_token}` }
    : {};
};

export const getAllUsers = async (session?: any): Promise<User[]> => {
  try {
    const response = await axiosInstance.get<User[]>("/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const getUserById = async (session?: any): Promise<User | null> => {
  try {
    // console.log("Session received in getUserById:", session);

    if (!session?.user?.access_token) {
      console.error("No access token found in session.");
      return null;
    }

    const decoded: JWTPayload = jwtDecode(session.user.access_token);
    // console.log("Decoded token:", decoded);

    if (!decoded.id) {
      console.error("No user ID found in decoded token.");
      return null;
    }

    const headers = await authHeaders(session);
    // console.log("Request headers:", headers);
    // console.log("Making request to:", `${API_URL}/users/${decoded.id}`);

    const response = await axiosInstance.get<User>(
      `${API_URL}/users/${decoded.id}`,
      {
        headers,
      }
    );

    // console.log("API Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching user details:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack,
    });

    if (error.response?.status === 400) {
      console.error("Invalid user ID format");
    } else if (error.response?.status === 401) {
      console.error("Unauthorized - Token might be invalid or expired");
    } else if (error.response?.status === 404) {
      console.error("User not found");
    }

    return null;
  }
};

export const getUser = async (query: string): Promise<User | null> => {
  try {
    const headers = await authHeaders();
    let response;
    if (query.includes("@")) {
      response = await axiosInstance.get<User>(`${API_URL}/user/${query}`, {
        headers,
      });
    } else {
      response = await axiosInstance.get<User>(`${API_URL}/users/${query}`, {
        headers,
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
    const headers = await authHeaders();
    const response = await axiosInstance.post<User>(`${API_URL}/users`, user, {
      headers,
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
    const headers = await authHeaders();
    const response = await axiosInstance.patch<User>(
      `${API_URL}/users/${userId}`,
      user,
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    const headers = await authHeaders();
    await axiosInstance.delete(`${API_URL}/users/${userId}`, {
      headers,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

export const getUserDetailsById = async (
  userId: string
): Promise<User | null> => {
  try {
    const response = await axiosInstance.get<User>(
      `${API_URL}/users/${userId}`,
      {
        headers: {
          accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching user details (${userId}):`, error);
    return null;
  }
};
