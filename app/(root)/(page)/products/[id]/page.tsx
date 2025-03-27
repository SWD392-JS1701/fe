"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateQuantity } from "@/lib/redux/cartSlice";
import { RootState } from "@/lib/redux/store";
import Comment from "@/components/Comment";
import { Product } from "@/app/types/product";
import { Rating } from "@/app/types/rating";
import { getProductById } from "@/app/services/productService";
import { getRatingsByProduct } from "@/app/services/ratingService";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart.items);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [ratings, setRatings] = useState<Rating[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [productData, ratingsData] = await Promise.all([
          getProductById(id as string),
          getRatingsByProduct(id as string),
        ]);
        setProduct(productData);
        setRatings(ratingsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <p className="text-center text-xl text-gray-500">
        Loading product details...
      </p>
    );
  }

  if (!product) {
    return (
      <p className="text-center text-2xl text-red-500">Product not found</p>
    );
  }

  const handleAddToCart = () => {
    const existingProduct = cart.find((item) => item.id === product._id);
    if (existingProduct) {
      dispatch(
        updateQuantity({
          id: product._id,
          quantity: existingProduct.quantity + quantity,
        })
      );
    } else {
      dispatch(
        addToCart({
          id: product._id,
          name: product.name,
          price: product.price,
          quantity,
          image_url: product.image_url,
        })
      );
    }
  };

  const averageRating =
    ratings.length > 0
      ? (
          ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="bg-white dark:bg-gray-900 py-12 mt-[120px]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Left Section - Product Image */}
          <div className="md:w-1/2">
            <div className="h-[600px] rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <img
                className="w-full h-full object-cover rounded-xl"
                src={product.image_url}
                alt={product.name}
              />
            </div>
          </div>

          {/* Right Section - Product Details */}
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              {product.name}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
              Supplier: {product.Supplier}
            </p>

            {/* Rating */}
            <div className="flex items-center mt-4">
              <span className="text-yellow-500 text-2xl font-semibold">
                ⭐ {averageRating}
              </span>
              <span className="text-gray-600 text-lg ml-3">
                (Customer Reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center mt-4">
              <span className="text-3xl font-bold text-black">
                ${product.price.toFixed(2)}
              </span>
            </div>

            {/* Availability */}
            <p className="text-lg text-gray-700 dark:text-gray-300 mt-3">
              {product.stock > 0
                ? `In Stock (${product.stock} available)`
                : "Out of Stock"}
            </p>

            {/* Volume */}
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
              Volume: {product.volume} ml
            </p>

            {/* Quantity Selector */}
            <div className="mt-6">
              <label className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                QUANTITY:
              </label>
              <div className="flex items-center mt-2">
                <button
                  onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                  className="border border-gray-400 px-5 py-2 text-2xl rounded-lg hover:bg-gray-200 cursor-pointer"
                >
                  -
                </button>
                <span className="px-6 text-2xl font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="border border-gray-400 px-5 py-2 text-2xl rounded-lg hover:bg-gray-200 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-6 mt-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white py-4 text-xl font-semibold rounded-lg hover:bg-gray-800 transition cursor-pointer"
              >
                Add to Cart
              </button>
            </div>

            {/* Product Description */}
            <div className="mt-8">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-300">
                Product Description:
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mt-3">
                {product.description}
              </p>
            </div>
          </div>
        </div>
        <h3 className="text-3xl font-extrabold italic text-black uppercase text-center mt-15 mb-10">
          Reviews
        </h3>
        {/* Review Section */}
        <Comment productId={id as string} />
      </div>
    </div>
  );
};

export default ProductDetail;
