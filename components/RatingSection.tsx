import React, { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import {
  getRatingsByProduct,
  addRating,
  deleteRating,
} from "@/app/services/ratingService";
import { getUserById } from "@/app/services/userService";
import { User } from "@/app/types/user";
import { Rating, CreateRatingInput } from "@/app/types/rating";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

interface RatingSectionProps {
  productId: string;
}

interface RatingWithUser extends Rating {
  user?: User;
}

const RatingSection: React.FC<RatingSectionProps> = ({ productId }) => {
  const [ratings, setRatings] = useState<RatingWithUser[]>([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const { data: session } = useSession();

  const fetchUserDetails = async (
    ratings: Rating[]
  ): Promise<RatingWithUser[]> => {
    try {
      const ratingsWithUsers = await Promise.all(
        ratings.map(async (rating) => {
          try {
            const user = await getUserById(rating.user_id);
            return { ...rating, user };
          } catch (error) {
            // If user fetch fails, just return the rating without user details
            console.error(
              `Error fetching user for rating ${rating._id}:`,
              error
            );
            return { ...rating, user: undefined };
          }
        })
      );
      return ratingsWithUsers;
    } catch (error) {
      console.error("Error fetching user details:", error);
      // Return ratings without user details if the overall process fails
      return ratings.map((rating) => ({ ...rating, user: undefined }));
    }
  };

  const fetchRatings = async () => {
    try {
      const data = await getRatingsByProduct(productId);
      const ratingsWithUsers = await fetchUserDetails(data);
      setRatings(ratingsWithUsers);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load ratings");
    }
  };

  useEffect(() => {
    if (productId) {
      fetchRatings();
    }
  }, [productId]);

  const handleAddRating = async () => {
    if (!productId) {
      toast.error("Product ID is missing");
      return;
    }
    if (!session?.user?.id) {
      toast.error("Please sign in to add a rating");
      return;
    }
    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }
    if (newRating < 1 || newRating > 5) {
      toast.error("Rating must be between 1 and 5");
      return;
    }

    try {
      const stringProductId = String(productId);
      const newRatingData: CreateRatingInput = {
        product_id: stringProductId,
        user_id: session.user.id,
        rating: newRating,
        comment: newComment.trim(),
      };

      const rating = await addRating(newRatingData);
      const ratingWithUser = await fetchUserDetails([rating]);
      setRatings([...ratings, ratingWithUser[0]]);
      setNewComment("");
      setNewRating(5);
      toast.success("Rating added successfully");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to add rating";
      console.error("Error in handleAddRating:", {
        error,
        errorMessage,
        productId,
        productIdType: typeof productId,
        session,
      });
      toast.error(errorMessage);
    }
  };

  const handleDeleteRating = async (ratingId: string) => {
    try {
      await deleteRating(ratingId);
      setRatings(ratings.filter((rating) => rating._id !== ratingId));
      toast.success("Rating deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete rating");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h3>{ratings.length} Ratings</h3>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="number"
          min="1"
          max="5"
          value={newRating}
          onChange={(e) => setNewRating(Number(e.target.value))}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          style={{ marginRight: "10px", width: "200px" }}
        />
        <button
          onClick={handleAddRating}
          style={{
            padding: "5px 10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </div>
      {ratings.map((rating) => (
        <div
          key={rating._id}
          style={{
            marginBottom: "20px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <strong>
              {rating.user
                ? `${rating.user.first_name} ${rating.user.last_name}`
                : rating.user_id}
            </strong>
            <span style={{ color: "#666" }}>
              {format(new Date(rating.createdAt), "dd/MM/yyyy HH:mm")}
            </span>
          </div>
          <p style={{ margin: "10px 0" }}>
            {"⭐".repeat(rating.rating)} {rating.rating}/5
          </p>
          <p style={{ margin: "10px 0" }}>{rating.comment}</p>
          {session?.user?.id === rating.user_id && (
            <div>
              <button
                onClick={() => handleDeleteRating(rating._id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ff4444",
                  cursor: "pointer",
                }}
              >
                <FaTrashAlt />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RatingSection;
