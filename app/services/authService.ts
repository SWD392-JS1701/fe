import axiosInstance from "./axiosInstance";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "../types/token";

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

export const changePassword = async (token: string, newPassword: string) => {
  try {
    const response = await axiosInstance.post("/auth/reset-password", {
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
    const response = await axiosInstance.put("/auth/change-password", {
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
