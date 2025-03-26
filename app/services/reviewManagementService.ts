import { API_URL } from "@/config";
import axiosInstance from "./axiosInstance";
import { Rating } from "../types/rating";
import { User } from "../types/user";
import { Product } from "../types/product";

export interface ReviewWithDetails extends Rating {
  user: User | null;
  product: Product | null;
}

// Fetch all reviews with user and product details
export const getAllReviewsWithDetails = async (): Promise<
  ReviewWithDetails[]
> => {
  try {
    // Get all ratings
    const ratingsResponse = await axiosInstance.get<Rating[]>(
      `${API_URL}/ratings`
    );
    const ratings = ratingsResponse.data;

    // Fetch user and product details for each rating
    const reviewsWithDetails = await Promise.all(
      ratings.map(async (rating) => {
        try {
          // Fetch user details
          const userResponse = await axiosInstance.get<User>(
            `${API_URL}/users/${rating.user_id}`
          );
          const user = userResponse.data;

          // Fetch product details
          const productResponse = await axiosInstance.get<Product>(
            `${API_URL}/products/${rating.product_id}`
          );
          const product = productResponse.data;

          return {
            ...rating,
            user,
            product,
          };
        } catch (error) {
          console.error(
            `Error fetching details for rating ${rating._id}:`,
            error
          );
          // If we fail to fetch user or product details, return the rating with null values
          return {
            ...rating,
            user: null,
            product: null,
          };
        }
      })
    );

    return reviewsWithDetails;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw new Error("Failed to fetch reviews");
  }
};

// Delete a review by ID
export const deleteReviewById = async (reviewId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`${API_URL}/ratings/${reviewId}`);
  } catch (error) {
    console.error(`Error deleting review ${reviewId}:`, error);
    throw new Error("Failed to delete review");
  }
};

// Get reviews by date range
export const getReviewsByDateRange = async (
  startDate: Date,
  endDate: Date
): Promise<ReviewWithDetails[]> => {
  try {
    const reviews = await getAllReviewsWithDetails();
    return reviews.filter((review) => {
      const reviewDate = new Date(review.createdAt);
      return reviewDate >= startDate && reviewDate <= endDate;
    });
  } catch (error) {
    console.error("Error fetching reviews by date range:", error);
    throw new Error("Failed to fetch reviews by date range");
  }
};

// Get reviews by rating
export const getReviewsByRating = async (
  rating: number
): Promise<ReviewWithDetails[]> => {
  try {
    const reviews = await getAllReviewsWithDetails();
    return reviews.filter((review) => review.rating === rating);
  } catch (error) {
    console.error(`Error fetching reviews with rating ${rating}:`, error);
    throw new Error("Failed to fetch reviews by rating");
  }
};

// Get reviews by product ID
export const getReviewsByProduct = async (
  productId: string
): Promise<ReviewWithDetails[]> => {
  try {
    const reviews = await getAllReviewsWithDetails();
    return reviews.filter((review) => review.product_id === productId);
  } catch (error) {
    console.error(`Error fetching reviews for product ${productId}:`, error);
    throw new Error("Failed to fetch reviews by product");
  }
};

// Get reviews by user ID
export const getReviewsByUser = async (
  userId: string
): Promise<ReviewWithDetails[]> => {
  try {
    const reviews = await getAllReviewsWithDetails();
    return reviews.filter((review) => review.user_id === userId);
  } catch (error) {
    console.error(`Error fetching reviews for user ${userId}:`, error);
    throw new Error("Failed to fetch reviews by user");
  }
};
