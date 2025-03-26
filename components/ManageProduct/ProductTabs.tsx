"use client";

import React, { FC, useState, useEffect } from "react";
import { Product } from "../../app/types/product";
import { Rating } from "@/app/types/rating";
import { getRatingsByProduct } from "@/app/services/ratingService";
import { fetchUser } from "@/app/controller/userController";

interface ProductTabsProps {
  product: Product;
}

interface RatingWithUser extends Rating {
  userName: string;
}

const ProductTabs: FC<ProductTabsProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [ratings, setRatings] = useState<RatingWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchRatings = async () => {
      if (activeTab === "reviews") {
        setIsLoading(true);
        try {
          const productRatings = await getRatingsByProduct(product._id);
          const ratingsWithUsers = await Promise.all(
            productRatings.map(async (rating) => {
              const user = await fetchUser(rating.user_id);
              return {
                ...rating,
                userName: user?.username || "Unknown User",
              };
            })
          );
          setRatings(ratingsWithUsers);
        } catch (error) {
          console.error("Failed to fetch ratings:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchRatings();
  }, [activeTab, product._id]);

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-4 text-sm border-b border-gray-200">
        <button
          className={`pb-2 font-semibold ${
            activeTab === "overview"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`pb-2 ${
            activeTab === "reviews"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "overview" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Product Description
              </h3>
              <p className="text-sm text-gray-600">{product.description}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Product Details
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price</span>
                  <span className="text-gray-800">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stock</span>
                  <span className="text-gray-800">{product.stock}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Supplier</span>
                  <span className="text-gray-800">
                    {product.Supplier || "Currently no supplier"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expired Date</span>
                  <span className="text-gray-800">
                    {formatDate(product.expired_date)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Volume</span>
                  <span className="text-gray-800">{product.volume} ml</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created At</span>
                  <span className="text-gray-800">
                    {formatDate(product.created_at)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Updated At</span>
                  <span className="text-gray-800">
                    {formatDate(product.updated_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === "reviews" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Reviews</h3>
            <p className="text-sm text-gray-600 mb-4">
              {ratings.length} Reviews
            </p>
            {isLoading ? (
              <p className="text-gray-600">Loading reviews...</p>
            ) : ratings.length > 0 ? (
              ratings.map((review) => (
                <div
                  key={review._id}
                  className="p-4 mb-4 bg-gray-100 rounded-lg"
                >
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-500 text-lg">
                      ★ {review.rating}
                    </span>
                    <span className="ml-2 text-gray-800 font-semibold">
                      {review.comment}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    By: {review.userName},{" "}
                    {formatDate(review.createdAt.toString())}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No reviews yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
