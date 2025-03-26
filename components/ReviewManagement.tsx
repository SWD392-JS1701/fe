"use client";
import React, { useState, useEffect } from "react";
import { FaTrashAlt, FaStar, FaSearch, FaCalendarAlt } from "react-icons/fa";
import {
  getAllReviewsWithDetails,
  deleteReviewById,
  ReviewWithDetails,
} from "@/app/services/reviewManagementService";
import { format, subDays } from "date-fns";
import { toast } from "react-hot-toast";
import Link from "next/link";

const ReviewManagement: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [dateFilter, setDateFilter] = useState<string>("all"); // all, today, week, month

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getAllReviewsWithDetails();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDeleteReview = async (reviewId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this review? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteReviewById(reviewId);
      setReviews(reviews.filter((review) => review._id !== reviewId));
      toast.success("Review deleted successfully");
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
  };

  const getDateFilteredReviews = (reviews: ReviewWithDetails[]) => {
    const now = new Date();
    switch (dateFilter) {
      case "today":
        return reviews.filter(
          (review) =>
            format(new Date(review.createdAt), "yyyy-MM-dd") ===
            format(now, "yyyy-MM-dd")
        );
      case "week":
        const weekAgo = subDays(now, 7);
        return reviews.filter(
          (review) => new Date(review.createdAt) >= weekAgo
        );
      case "month":
        const monthAgo = subDays(now, 30);
        return reviews.filter(
          (review) => new Date(review.createdAt) >= monthAgo
        );
      default:
        return reviews;
    }
  };

  const filteredReviews = getDateFilteredReviews(reviews).filter((review) => {
    const matchesSearch =
      review.user?.first_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      review.user?.last_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.product?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating =
      filterRating === null || review.rating === filterRating;

    return matchesSearch && matchesRating;
  });

  const reviewStats = {
    total: reviews.length,
    average:
      reviews.length > 0
        ? (
            reviews.reduce((acc, review) => acc + review.rating, 0) /
            reviews.length
          ).toFixed(1)
        : 0,
    distribution: Array.from({ length: 5 }, (_, i) => i + 1).map((rating) => ({
      rating,
      count: reviews.filter((review) => review.rating === rating).length,
    })),
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Review Management</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-lg font-medium">Total Reviews</div>
            <div className="text-3xl font-bold">{reviewStats.total}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-lg font-medium">Average Rating</div>
            <div className="text-3xl font-bold flex items-center gap-2">
              {reviewStats.average} <FaStar className="text-yellow-400" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-lg font-medium mb-2">Rating Distribution</div>
            <div className="space-y-1">
              {reviewStats.distribution.reverse().map(({ rating, count }) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="w-12">{rating} ★</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{
                        width: `${
                          reviewStats.total
                            ? (count / reviewStats.total) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <span className="w-12 text-right text-sm text-gray-500">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by user, product, or review content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="flex gap-2">
          {[null, 5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating ?? "all"}
              onClick={() => setFilterRating(rating)}
              className={`px-4 py-2 rounded-full border ${
                filterRating === rating
                  ? "bg-black text-white"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              {rating === null ? "All" : `${rating} ★`}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {[
            { value: "all", label: "All Time" },
            { value: "today", label: "Today" },
            { value: "week", label: "This Week" },
            { value: "month", label: "This Month" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setDateFilter(option.value)}
              className={`px-4 py-2 rounded-full border flex items-center gap-2 ${
                dateFilter === option.value
                  ? "bg-black text-white"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <FaCalendarAlt className="text-sm" />
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading reviews...</div>
      ) : (
        <div className="grid gap-4">
          {filteredReviews.map((review) => (
            <div
              key={review._id}
              className="p-6 border border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Link
                    href={`/products/${review.product_id}`}
                    className="text-lg font-medium hover:underline"
                  >
                    {review.product?.name || "Unknown Product"}
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        className={`${
                          review.rating > index
                            ? "text-yellow-400"
                            : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteReview(review._id)}
                  className="text-red-500 hover:text-red-700 transition-all p-2 hover:bg-red-50 rounded-full"
                  title="Delete review"
                >
                  <FaTrashAlt />
                </button>
              </div>

              <p className="text-gray-700 mb-4">{review.comment}</p>

              <div className="flex justify-between items-end text-sm text-gray-500">
                <div>
                  <div className="font-medium">
                    {review.user
                      ? `${review.user.first_name} ${review.user.last_name}`
                      : "Unknown User"}
                  </div>
                  <div className="text-gray-400">
                    {review.user?.email || "No email provided"}
                  </div>
                </div>
                <div className="text-right">
                  <div>{format(new Date(review.createdAt), "MMM d, yyyy")}</div>
                  <div className="text-xs text-gray-400">
                    {format(new Date(review.createdAt), "h:mm a")}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredReviews.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No reviews found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewManagement;
