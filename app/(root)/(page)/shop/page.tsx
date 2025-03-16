"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  getAllProducts,
  searchProductsByName,
} from "@/app/services/productService";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/app/types/product";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

const ShopPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Just Dropped");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [currentPriceRange, setCurrentPriceRange] = useState({
    min: 0,
    max: 1000,
  });
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const searchTerm = searchParams.get("search");
        let data: Product[];

        if (searchTerm) {
          data = await searchProductsByName(searchTerm);
        } else {
          data = await getAllProducts();
        }

        setProducts(data);
        // Set initial price range based on products
        if (data.length > 0) {
          const prices = data.map((p) => p.price);
          const minPrice = Math.floor(Math.min(...prices));
          const maxPrice = Math.ceil(Math.max(...prices));
          setPriceRange({ min: minPrice, max: maxPrice });
          setCurrentPriceRange({ min: minPrice, max: maxPrice });
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  // Sort and filter products
  const filteredAndSortedProducts = useMemo(() => {
    const productsToSort = [...products].filter(
      (product) =>
        product.price >= currentPriceRange.min &&
        product.price <= currentPriceRange.max
    );

    switch (selectedSort) {
      case "Just Dropped":
        return productsToSort.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

      case "Price: Low - High":
        return productsToSort.sort((a, b) => a.price - b.price);

      case "Price: High - Low":
        return productsToSort.sort((a, b) => b.price - a.price);

      case "Customer Rating":
        return productsToSort.sort(
          (a, b) => b.product_rating - a.product_rating
        );

      default:
        return productsToSort;
    }
  }, [products, selectedSort, currentPriceRange]);

  const handleSort = (sortOption: string) => {
    setSelectedSort(sortOption);
    setShowSort(false);
  };

  const handlePriceRangeChange = (type: "min" | "max", value: number) => {
    setCurrentPriceRange((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleApplyFilters = () => {
    setShowFilter(false);
  };

  const handleResetFilters = () => {
    setCurrentPriceRange(priceRange);
  };

  return (
    <div className="relative p-8 bg-gray-100 min-h-screen mt-30">
      {/* Header */}
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black italic text-black tracking-tight">
            {filteredAndSortedProducts.length}{" "}
            <span className="font-extrabold italic">
              {filteredAndSortedProducts.length === 1 ? "Item" : "Items"}
            </span>
            {searchParams.get("search") && (
              <span className="text-lg font-normal ml-2">
                for "{searchParams.get("search")}"
              </span>
            )}
          </h1>
          <p className="text-gray-600">
            {searchParams.get("search")
              ? `Search results for "${searchParams.get("search")}"`
              : "Browse our collection of products"}
          </p>
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
        ) : filteredAndSortedProducts.length === 0 ? (
          <p className="text-center text-gray-500 text-lg col-span-full">
            No products found.
          </p>
        ) : (
          filteredAndSortedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        )}
      </div>

      {/* Sort Panel */}
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
        <ul className="relative space-y-2 bg-white p-2 rounded-md">
          {[
            //"Favourite",
            "Just Dropped",
            "Price: Low - High",
            "Price: High - Low",
            "Customer Rating",
            //"Brand: A - Z",
            //"All items",
          ].map((sortOption) => (
            <li
              key={sortOption}
              className="relative flex items-center px-4 py-2 cursor-pointer rounded-md transition-colors duration-300"
              onClick={() => handleSort(sortOption)}
            >
              {selectedSort === sortOption && (
                <motion.div
                  layoutId="activeSort"
                  className="absolute inset-0 bg-black rounded-md"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
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
      </div>

      {/* Filter Panel */}
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
        <div className="space-y-6">
          <label className="block">
            <span className="text-gray-700">Category</span>
            <select className="block w-full border rounded-md p-3 mt-2">
              <option>All</option>
              <option>Skincare</option>
              <option>Makeup</option>
              <option>Fragrance</option>
            </select>
          </label>

          {/* Price Range Filter */}
          <div className="space-y-4">
            <span className="text-gray-700 block">Price Range</span>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="text-sm text-gray-600">Min Price</label>
                <input
                  type="number"
                  min={priceRange.min}
                  max={currentPriceRange.max}
                  value={currentPriceRange.min}
                  onChange={(e) =>
                    handlePriceRangeChange("min", Number(e.target.value))
                  }
                  className="w-full border rounded-md p-2 mt-1"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm text-gray-600">Max Price</label>
                <input
                  type="number"
                  min={currentPriceRange.min}
                  max={priceRange.max}
                  value={currentPriceRange.max}
                  onChange={(e) =>
                    handlePriceRangeChange("max", Number(e.target.value))
                  }
                  className="w-full border rounded-md p-2 mt-1"
                />
              </div>
            </div>
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              value={currentPriceRange.max}
              onChange={(e) =>
                handlePriceRangeChange("max", Number(e.target.value))
              }
              className="w-full"
            />
          </div>

          <div className="flex space-x-4">
            <button
              className="flex-1 bg-black text-white px-4 py-2 rounded-md text-lg cursor-pointer"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </button>
            <button
              className="flex-1 bg-gray-200 text-black px-4 py-2 rounded-md text-lg cursor-pointer"
              onClick={handleResetFilters}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
