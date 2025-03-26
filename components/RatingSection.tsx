import React, { useState, useEffect } from "react";
import { FaTrashAlt, FaStar } from "react-icons/fa";
import {
  getRatingsByProduct,
  addRating,
  deleteRating,
} from "@/app/services/ratingService";
import { getUserDetailsById } from "@/app/services/userService";
import { User } from "@/app/types/user";
import { Rating, CreateRatingInput } from "@/app/types/rating";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import Review from "./Review";

interface RatingSectionProps {
  productId: string;
}

interface RatingWithUser extends Rating {
  user: User | null;
}

const RatingSection: React.FC<RatingSectionProps> = ({ productId }) => {
  const [ratings, setRatings] = useState<RatingWithUser[]>([]);
  const [filteredRatings, setFilteredRatings] = useState<RatingWithUser[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { data: session } = useSession();

  const fetchUserDetails = async (
    ratings: Rating[]
  ): Promise<RatingWithUser[]> => {
    try {
      const ratingsWithUsers = await Promise.all(
        ratings.map(async (rating) => {
          const user = await getUserDetailsById(rating.user_id);
          return { ...rating, user };
        })
      );
      return ratingsWithUsers;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return ratings.map((rating) => ({ ...rating, user: null }));
    }
  };

  const fetchRatings = async () => {
    try {
      const data = await getRatingsByProduct(productId);
      const ratingsWithUsers = await fetchUserDetails(data);
      setRatings(ratingsWithUsers);
      setFilteredRatings(ratingsWithUsers);
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

  useEffect(() => {
    if (selectedRating === null) {
      setFilteredRatings(ratings);
    } else {
      setFilteredRatings(
        ratings.filter((rating) => rating.rating === selectedRating)
      );
    }
  }, [selectedRating, ratings]);

  const handleFilterChange = (rating: number | null) => {
    if (rating === null) {
      setShowFilters(!showFilters);
    } else if (rating === selectedRating) {
      setSelectedRating(null);
    } else {
      setSelectedRating(rating);
      setShowFilters(true);
    }
    setShowReviewForm(false);
  };

  const handleWriteReviewClick = () => {
    setShowReviewForm(true);
    setShowFilters(false);
  };

  const handleAddRating = async () => {
    if (!session?.user?.id) {
      toast.error("Please sign in to add a rating");
      return;
    }
    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    try {
      const newRatingData: CreateRatingInput = {
        product_id: productId,
        user_id: session.user.id,
        rating: newRating,
        comment: newComment.trim(),
      };

      const rating = await addRating(newRatingData);
      const ratingWithUser = await fetchUserDetails([rating]);
      const newRatings = [...ratings, ratingWithUser[0]];
      setRatings(newRatings);
      setNewComment("");
      setNewRating(5);
      setShowReviewForm(false);
      toast.success("Rating added successfully");
    } catch (error) {
      console.error("Error adding rating:", error);
      toast.error("Failed to add rating");
    }
  };

  const handleDeleteRating = async (ratingId: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      await deleteRating(ratingId);
      const newRatings = ratings.filter((rating) => rating._id !== ratingId);
      setRatings(newRatings);
      toast.success("Rating deleted successfully");
    } catch (error) {
      console.error("Error deleting rating:", error);
      toast.error("Failed to delete rating");
    }
  };

  return (
    <div className="p-5 font-sans">
      <Review
        ratings={ratings}
        onFilterChange={handleFilterChange}
        onWriteReviewClick={handleWriteReviewClick}
        showFilters={showFilters}
      />

      {showReviewForm && (
        <div className="mb-5 bg-white border border-gray-100 p-4 rounded-lg shadow-sm transition-all duration-300">
          <div className="flex items-center space-x-2 mb-3">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                className={`text-2xl cursor-pointer transition-all ${
                  newRating > index ? "text-yellow-400" : "text-gray-300"
                }`}
                onClick={() => setNewRating(index + 1)}
              />
            ))}
          </div>
          <textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-all duration-300 min-h-[100px]"
          />
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={() => setShowReviewForm(false)}
              className="px-4 py-2 cursor-pointer text-gray-600 hover:text-gray-800 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              onClick={handleAddRating}
              className="px-6 py-2 cursor-pointer bg-black text-white rounded-lg transition-all duration-300 hover:bg-gray-800"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      <div className="mb-4 text-sm text-gray-500">
        {filteredRatings.length}{" "}
        {filteredRatings.length === 1 ? "Review" : "Reviews"}
      </div>

      <div className="space-y-4">
        {filteredRatings.map((rating) => (
          <div
            key={rating._id}
            className="p-6 border border-gray-200 rounded-lg bg-white"
          >
            <div className="flex items-center gap-2 mb-2">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className={`text-lg ${
                    rating.rating > index ? "text-yellow-400" : "text-gray-200"
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-700 mb-4">{rating.comment}</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span>
                  {rating.user
                    ? `${rating.user.first_name} ${rating.user.last_name}`
                    : rating.user_id}
                </span>
                {session?.user?.id === rating.user_id && (
                  <button
                    onClick={() => handleDeleteRating(rating._id)}
                    className="text-red-500 cursor-pointer hover:text-red-700 transition-all"
                    title="Delete review"
                  >
                    <FaTrashAlt size={14} />
                  </button>
                )}
              </div>
              <div className="text-right">
                <div>{format(new Date(rating.createdAt), "MMM d, yyyy")}</div>
                <div className="text-xs text-gray-400">
                  {format(new Date(rating.createdAt), "h:mm a")}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingSection;
