"use client";

import React, { useEffect, useState } from "react";
import { getAllProducts } from "@/app/services/productService"; // API lấy sản phẩm
import ProductCard from "@/components/ProductCard";
import { Product } from "@/app/types/product";
import { motion } from "framer-motion";
const ShopPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Staff Faves");

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getAllProducts();
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div className="relative p-8 bg-gray-100 min-h-screen mt-30">
      {/* Header */}
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black italic text-black tracking-tight">
            {products.length}{" "}
            <span className="font-extrabold italic">Item</span>
          </h1>
          <p className="text-gray-600">Browse our collection of products</p>
        </div>
        {/* Sort & Filter Buttons */}
        <div className="flex gap-4">
          <button
            className="bg-black text-white px-4 py-2 rounded-md text-lg cursor-pointer"
            onClick={() => {
              setShowSort(!showSort);
              setShowFilter(false);
            }}
          >
            Sort: {selectedSort}
          </button>
          <button
            className="bg-black text-white px-4 py-2 rounded-md text-lg cursor-pointer"
            onClick={() => {
              setShowFilter(!showFilter);
              setShowSort(false);
            }}
          >
            Filter
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <p className="text-center text-gray-500 text-lg">
            Loading products...
          </p>
        ) : (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        )}
      </div>

      {/* Bảng 1 (Sort) */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-lg p-6 
          w-1/4 transition-transform duration-700 ease-in-out z-50 ${
            showSort ? "translate-x-0" : "translate-x-full"
          }`}
        style={{ fontSize: "1.2rem" }}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl cursor-pointer"
          onClick={() => setShowSort(false)}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4">Sort by</h2>
        <ul className="relative space-y-2 bg-white p-2 rounded-md ">
          {[
            "Favourite",
            "Just Dropped",
            "Price: Low - High",
            "Price: High - Low",
            "Customer Rating",
            "Brand: A - Z",
            "All items",
          ].map((sortOption) => (
            <li
              key={sortOption}
              className="relative flex items-center px-4 py-2 cursor-pointer rounded-md transition-colors duration-300"
              onClick={() => setSelectedSort(sortOption)}
            >
              {/* Nền đen di chuyển mượt mà, nhưng không che mất chữ */}
              {selectedSort === sortOption && (
                <motion.div
                  layoutId="activeSort"
                  className="absolute inset-0 bg-black rounded-md"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              {/* Giữ màu chữ của tất cả các tùy chọn */}
              <span
                className={`relative z-10 text-lg px-2 py-1 transition-colors duration-300 ${
                  selectedSort === sortOption ? "text-white" : "text-black"
                }`}
              >
                {sortOption}
              </span>
            </li>
          ))}
        </ul>
        <button
          className="mt-6 bg-black text-white px-4 py-2 rounded-md text-lg cursor-pointer"
          onClick={() => setShowSort(false)}
        >
          Done
        </button>
      </div>

      {/* Bảng 2 (Filter) */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-lg p-6 
          w-1/4 transition-transform duration-700 ease-in-out z-50 ${
            showFilter ? "translate-x-0" : "translate-x-full"
          }`}
        style={{ fontSize: "1.2rem" }}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl cursor-pointer"
          onClick={() => setShowFilter(false)}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4">Filter</h2>
        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-700">Category</span>
            <select className="block w-full border rounded-md p-3 mt-2">
              <option>All</option>
              <option>Skincare</option>
              <option>Makeup</option>
              <option>Fragrance</option>
            </select>
          </label>
          <label className="block">
            <span className="text-gray-700">Price Range</span>
            <input type="range" className="w-full" />
          </label>
        </div>
        <button
          className="mt-6 bg-black text-white px-4 py-2 rounded-md text-lg cursor-pointer"
          onClick={() => setShowFilter(false)}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default ShopPage;
