import { API_URL } from "@/config";
import axios from "axios";
import { Rating, CreateRatingInput } from "../types/rating";

export const getAllRatings = async (): Promise<Rating[]> => {
  try {
    const response = await axios.get(`${API_URL}/ratings`, {
      headers: {
        accept: "*/*",
      },
    });
    return response.data as Rating[];
  } catch (error: any) {
    console.error("Error fetching all ratings:", error.message || error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch all ratings"
    );
  }
};

export const getRatingsByProduct = async (
  productId: string
): Promise<Rating[]> => {
  try {
    const response = await axios.get(
      `${API_URL}/ratings/product/${productId}`,
      {
        headers: {
          accept: "*/*",
        },
      }
    );
    return response.data as Rating[];
  } catch (error: any) {
    console.error("Error fetching ratings by product:", error.message || error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch ratings by product"
    );
  }
};

export const getRatingsByUser = async (userId: string): Promise<Rating[]> => {
  try {
    const response = await axios.get(`${API_URL}/ratings/user/${userId}`, {
      headers: {
        accept: "*/*",
      },
    });
    return response.data as Rating[];
  } catch (error: any) {
    console.error("Error fetching ratings by user:", error.message || error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch ratings by user"
    );
  }
};

export const addRating = async (rating: CreateRatingInput): Promise<Rating> => {
  try {
    const response = await axios.post(`${API_URL}/ratings`, rating, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data as Rating;
  } catch (error: any) {
    console.error("Error adding rating:", error.message || error);
    throw new Error(error.response?.data?.message || "Failed to add rating");
  }
};

export const deleteRating = async (ratingId: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/ratings/${ratingId}`, {
      headers: {
        accept: "*/*",
      },
    });
  } catch (error: any) {
    console.error("Error deleting rating:", error.message || error);
    throw new Error(error.response?.data?.message || "Failed to delete rating");
  }
};
