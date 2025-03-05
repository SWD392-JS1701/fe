import axiosInstance from "./axiosInstance";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "../types/token";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
    const response = await axiosInstance.post("/auth/register", {
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
    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
    });

    const data = response.data;
    const accessToken = data.access_token;

    if (!accessToken) {
      throw new Error("No access token received from server.");
    }

    localStorage.setItem("access_token", accessToken);

    const decodedToken: DecodedToken = jwtDecode(accessToken);

    return { ...data, decodedToken };
  } catch (error: any) {
    console.error("Login API Error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch. Please try again."
    );
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await axiosInstance.put("/auth/change-password", {
      token,
      newPassword,
    });
    return response.data;
  } catch (error: any) {
    console.error("Reset Password API Error:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to reset password. Please try again."
    );
  }
};

export const forgetPassword = async (email: string) => {
  try {
    const response = await axiosInstance.post("/auth/forgot-password", {
      email,
    });
    return response.data;
  } catch (error: any) {
    console.error("Forget Password API Error:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to forget password. Please try again."
    );
  }
};

const getAccessToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }
  const storedToken = localStorage.getItem("access_token");

  if (!storedToken) return null;

  return storedToken;
};

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: { exp: number } = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);

    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};

export const useAuthRedirect = () => {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = getAccessToken();

    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("access_token");
      router.push("/sign-in");
    } else {
      setIsChecking(false);
    }
  }, [router]);

  return { isChecking };
};

export const getUserRole = (): string | null => {
  const token = getAccessToken();

  if (!token || isTokenExpired(token)) {
    return null;
  }

  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.role || null;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};
