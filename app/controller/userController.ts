import {
  getAllUsers,
  getUserById,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "@/app/services/userService";
import { toast } from "react-hot-toast";
import { User } from "../types/user";

export const fetchAllUsers = async (session?: any): Promise<User[]> => {
  try {
    const users = await getAllUsers(session);
    return users;
  } catch (error: any) {
    toast.error("Failed to fetch users. Please try again.");
    throw error;
  }
};

export const fetchUserById = async (session?: any): Promise<User | null> => {
  try {
    const user = await getUserById(session);
    if (!user) {
      toast.error("User not found or invalid session.");
    }
    return user;
  } catch (error: any) {
    toast.error("Failed to fetch user details. Please try again.");
    throw error;
  }
};

export const fetchUser = async (query: string): Promise<User | null> => {
  try {
    const user = await getUser(query);
    if (!user) {
      toast.error(`User with query '${query}' not found.`);
    }
    return user;
  } catch (error: any) {
    toast.error(
      `Failed to fetch user with query '${query}'. Please try again.`
    );
    throw error;
  }
};

export const createNewUser = async (user: User): Promise<User | null> => {
  try {
    const newUser = await createUser(user);
    if (newUser) {
      toast.success("User created successfully!");
    } else {
      toast.error("Failed to create user.");
    }
    return newUser;
  } catch (error: any) {
    toast.error("Failed to create user. Please try again.");
    throw error;
  }
};

export const updateExistingUser = async (
  userId: string,
  user: Partial<User>
): Promise<User | null> => {
  try {
    const updatedUser = await updateUser(userId, user);
    if (updatedUser) {
      toast.success("User updated successfully!");
    } else {
      toast.error("Failed to update user.");
    }
    return updatedUser;
  } catch (error: any) {
    toast.error("Failed to update user. Please try again.");
    throw error;
  }
};

export const deleteExistingUser = async (userId: string): Promise<void> => {
  try {
    await deleteUser(userId);
    toast.success("User deleted successfully!");
  } catch (error: any) {
    toast.error("Failed to delete user. Please try again.");
    throw error;
  }
};
