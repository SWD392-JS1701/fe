"use client";

import React, { useState } from "react";

const ShopPage = () => {
  const shops = [
    { name: "3D", count: 95 },
    { name: "2D", count: 13 },
    { name: "Audio", count: 8 },
    { name: "Templates", count: 1 },
    { name: "Tools", count: 1 },
  ];

  const items = [
    {
      id: 1,
      name: "Low Poly Swords - RPO Weapons",
      author: "BLINK",
      price: "Free",
      rating: null,
      reviews: null,
    },
    {
      id: 2,
      name: "Long Sword",
      author: "DIGITAL HORDE",
      price: "Free",
      rating: null,
      reviews: null,
    },
    {
      id: 3,
      name: "RPO Swords!",
      author: "ALEX LUSTH",
      price: "Free",
      rating: 4.3,
      reviews: 3,
    },
    {
      id: 4,
      name: "Fortasy Moon sword",
      author: "HOVL STUDIO",
      price: "Free",
      rating: 4.9,
      reviews: 7,
    },
  ];

  const [filters, setFilters] = useState({
    shopAvailable: "All",
    price: "Free",
    rating: "4 stars & up",
  });

  const [filterTags, setFilterTags] = useState<string[]>([]);

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));

    const tag = `${filterType}: ${value}`;
    if (!filterTags.includes(tag)) {
      setFilterTags((prevTags) => [...prevTags, tag]);
    }
  };

  const removeFilterTag = (tag: string) => {
    setFilterTags((prevTags) => prevTags.filter((t) => t !== tag));

    const [filterType] = tag.split(": ");
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]:
        filterType === "shopAvailable"
          ? "All"
          : filterType === "price"
          ? "Free"
          : "4 stars & up",
    }));
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Filters (Moved to Top) */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col">
            <select
              className="p-2 border border-gray-300 rounded-md w-40"
              value={filters.shopAvailable}
              onChange={(e) =>
                handleFilterChange("shopAvailable", e.target.value)
              }
            >
              <option>All</option>
              <option>Available</option>
              <option>Unavailable</option>
            </select>
            <label className="text-gray-700 mt-1 text-sm">Shop Available</label>
          </div>
          <div className="flex flex-col">
            <select
              className="p-2 border border-gray-300 rounded-md w-40"
              value={filters.price}
              onChange={(e) => handleFilterChange("price", e.target.value)}
            >
              <option>Free</option>
              <option>Paid</option>
            </select>
            <label className="text-gray-700 mt-1 text-sm">Price</label>
          </div>
          <div className="flex flex-col">
            <select
              className="p-2 border border-gray-300 rounded-md w-40"
              value={filters.rating}
              onChange={(e) => handleFilterChange("rating", e.target.value)}
            >
              <option>4 stars & up</option>
              <option>3 stars & up</option>
              <option>2 stars & up</option>
              <option>1 star & up</option>
            </select>
            <label className="text-gray-700 mt-1 text-sm">Rating</label>
          </div>
        </div>

        {/* Filter Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {filterTags.map((tag) => (
            <div
              key={tag}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
            >
              <span>{tag}</span>
              <button
                onClick={() => removeFilterTag(tag)}
                className="text-blue-800 hover:text-blue-900"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">"sword" in All Shops</h1>
        <p className="text-gray-600">Results 1-96 of 118 for sword</p>
      </div>

      {/* Main Content */}
      <div className="flex gap-8">
        {/* Sidebar - Shops */}
        <div className="w-1/4 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">SHOPS</h2>
          <ul>
            {shops.map((shop) => (
              <li key={shop.name} className="mb-2">
                <span className="text-gray-700">{shop.name}</span>
                <span className="text-gray-500 ml-2">({shop.count})</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Items List */}
        <div className="w-3/4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                <p className="text-gray-600 mb-2">by {item.author}</p>
                <p className="text-green-600 font-bold mb-2">{item.price}</p>
                {item.rating && (
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-500">★★★★★</span>
                    <span className="text-gray-600 ml-2">
                      {item.rating} ({item.reviews} reviews)
                    </span>
                  </div>
                )}
                <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
