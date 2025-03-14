"use client";

import React, { useState } from "react";
import { Product } from "../../app/types/product";

interface ProductTabsProps {
  product: Product;
}

const ProductTabs: React.FC<ProductTabsProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState("overview");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Fake review data
  const fakeReviews = [
    {
      id: 1,
      rating: 5,
      comment:
        "Fabulous Purchase made! I purchased two of these single-seater recliner sofas. They are incredible. They offer good back support and recline to a proper angle to get a good experience.",
      author: "Alex Smith",
      location: "California",
      date: new Date("2024-10-01").toISOString(),
      certified: true,
    },
    {
      id: 2,
      rating: 5,
      comment:
        "Amazing product! The comfort is unmatched, and the design fits perfectly in my living room. Highly recommend!",
      author: "Sarah Johnson",
      location: "Texas",
      date: new Date("2024-09-15").toISOString(),
      certified: true,
    },
    {
      id: 3,
      rating: 4,
      comment:
        "Great value for money. The recliner is sturdy, but the assembly took a bit longer than expected.",
      author: "Michael Brown",
      location: "New York",
      date: new Date("2024-08-20").toISOString(),
      certified: false,
    },
    {
      id: 4,
      rating: 5,
      comment:
        "Fabulous Purchase made! I purchased two of these single-seater recliner sofas. They are incredible. They offer good back support and recline to a proper angle to get a good experience.",
      author: "Emily Davis",
      location: "Florida",
      date: new Date("2024-07-10").toISOString(),
      certified: true,
    },
  ];

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
        <button
          className={`pb-2 ${
            activeTab === "openOrders"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("openOrders")}
        >
          Open Orders
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
            <p className="text-sm text-gray-600 mb-4">112 Reviews</p>
            {fakeReviews.map((review) => (
              <div key={review.id} className="p-4 mb-4 bg-gray-100 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="text-yellow-500 text-lg">
                    ★ {review.rating}
                  </span>
                  <span className="ml-2 text-gray-800 font-semibold">
                    {review.comment.split("!")[0]}!
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {review.comment.split("!").slice(1).join("!").trim()}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {review.author}{" "}
                  {review.certified && (
                    <span className="text-green-500">ⓒ Certified Buyer</span>
                  )}
                  , {review.location} {formatDate(review.date)} ago
                </p>
              </div>
            ))}
            <a href="#" className="text-sm text-green-600 hover:underline">
              Load more...
            </a>
          </div>
        )}
        {activeTab === "openOrders" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Open Orders</h3>
            <p className="text-sm text-gray-600">No open orders available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
