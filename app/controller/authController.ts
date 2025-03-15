import {
  register,
  login,
  resetPassword,
  forgetPassword,
  getUserRole,
} from "@/app/services/authService";
import { toast } from "react-hot-toast";

export const registerUser = async (
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
    const user = await register(
      username,
      email,
      plainPassword,
      first_name,
      last_name,
      phone_number,
      address,
      role
    );
    toast.success("Registration successful! Please log in.");
    return user;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const data = await login(email, password);
    toast.success("Login successful!");
    return data;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const resetUserPassword = async (token: string, newPassword: string) => {
  try {
    const result = await resetPassword(token, newPassword);
    toast.success("Password reset successful!");
    return result;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const forgetUserPassword = async (email: string) => {
  try {
    const result = await forgetPassword(email);
    toast.success("Password reset email sent! Check your inbox.");
    return result;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const getCurrentUserRole = async () => {
  try {
    const role = getUserRole();
    if (!role) {
      toast.error("Unable to retrieve user role. Please log in again.");
      throw new Error("No valid role found.");
    }
    return role;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};
