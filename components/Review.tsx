import React from "react";
import { FaStar } from "react-icons/fa";
import { Rating } from "@/app/types/rating";

interface ReviewProps {
  ratings: Rating[];
  onFilterChange: (rating: number | null) => void;
  onWriteReviewClick: () => void;
  showFilters: boolean;
}

const Review: React.FC<ReviewProps> = ({
  ratings,
  onFilterChange,
  onWriteReviewClick,
  showFilters,
}) => {
  // Calculate average rating
  const averageRating =
    ratings.length > 0
      ? (
          ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length
        ).toFixed(1)
      : "0.0";

  // Count ratings for each star level
  const ratingCounts: Record<number, number> = {
    5: ratings.filter((r) => r.rating === 5).length,
    4: ratings.filter((r) => r.rating === 4).length,
    3: ratings.filter((r) => r.rating === 3).length,
    2: ratings.filter((r) => r.rating === 2).length,
    1: ratings.filter((r) => r.rating === 1).length,
  };

  // Calculate recommendation percentage (assuming 4-5 stars are recommendations)
  const recommendationPercentage =
    ratings.length > 0
      ? Math.round(
          (ratings.filter((r) => r.rating >= 4).length / ratings.length) * 100
        )
      : 0;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-semibold">{averageRating}</span>
          <div className="flex">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                className={`text-2xl ${
                  index < Math.round(Number(averageRating))
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-gray-600 text-sm">
            Based on {ratings.length}{" "}
            {ratings.length === 1 ? "review" : "reviews"}
          </span>
        </div>
        <div className="text-right">
          <p className="text-lg font-medium">{recommendationPercentage}%</p>
          <p className="text-gray-600 text-sm">would recommend this product</p>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        {[5, 4, 3, 2, 1].map((stars) => (
          <div key={stars} className="flex items-center gap-2">
            <span className="w-3">{stars}</span>
            <FaStar className="text-gray-400" />
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-900"
                style={{
                  width: `${
                    ratings.length > 0
                      ? (ratingCounts[stars] / ratings.length) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
            <span className="w-6 text-right text-gray-600">
              {ratingCounts[stars]}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <button
          className="px-4 py-5 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          onClick={() => onFilterChange(null)}
        >
          FILTERS
        </button>
        <button
          className="px-6 py-5 text-sm font-medium text-white bg-red-400 rounded-full hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
          onClick={onWriteReviewClick}
        >
          WRITE A REVIEW
        </button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-2 mt-4">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => onFilterChange(rating)}
              className="flex items-center gap-1 px-4 py-2 text-sm border rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <FaStar className="text-gray-400" />
              <span>{rating}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Review;
