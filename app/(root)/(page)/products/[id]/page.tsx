"use client";

import React, { useEffect, useState, MouseEvent } from "react";
import Comment from "@/components/Comment";

import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateQuantity } from "@/lib/redux/cartSlice";
import { RootState } from "@/lib/redux/store";
import { getProductById, Product } from "@/app/services/productService";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart.items);
  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    // e.preventDefault();
    // e.stopPropagation();
    // const existingProduct = cart.find((item) => item.id === product._id);
    // if (existingProduct) {
    //   dispatch(
    //     updateQuantity({
    //       id: product._id,
    //       quantity: existingProduct.quantity + 1,
    //     })
    //   );
    // } else {
    //   dispatch(
    //     addToCart({
    //       id: product._id,
    //       name: product.name,
    //       price: product.price,
    //       quantity: 1,
    //     })
    //   );
    // }
  };

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      const data = await getProductById(id as string);
      setProduct(data);
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <p className="text-center text-gray-500">Loading product details...</p>
    );
  }

  if (!product) {
    return <p className="text-center text-red-500">Product not found</p>;
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-800 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row -mx-4">
          {/* Left Section - Product Image */}
          <div className="md:flex-1 px-4">
            <div className="h-[460px] rounded-lg bg-gray-300 dark:bg-gray-700 mb-4">
              <img
                className="w-full h-full object-cover"
                src={product.image_url}
                alt={product.name}
              />
            </div>
            <div className="flex -mx-2 mb-4">
              <div className="w-1/2 px-2">
                <button
                  className="bg-indigo-600 flex gap-2 items-center justify-center text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-full"
                  onClick={handleAddToCart}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                    />
                  </svg>
                  Add to Cart
                </button>
              </div>
              <div className="w-1/2 px-2">
                <button className="bg-gray-200 flex gap-2 items-center justify-center text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 w-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                  Wishlist
                </button>
              </div>
            </div>
          </div>

          {/* Right Section - Product Details */}
          <div className="md:flex-1 px-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {product.name}
            </h2>
            <div className="flex mb-4">
              <div className="mr-4">
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  Price:
                </span>
                <span className="text-gray-600 dark:text-gray-300 ml-2">
                  ${product.price.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  Availability:
                </span>
                <span className="text-gray-600 dark:text-gray-300 ml-2">
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>

            {/* Supplier & Volume */}
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  Supplier:
                </span>{" "}
                {product.Supplier}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  Volume:
                </span>{" "}
                {product.volume} ml
              </p>
            </div>

            {/* Product Description */}
            <div>
              <span className="font-bold text-gray-700 dark:text-gray-300">
                Product Description:
              </span>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <Comment />
    </div>
  );
};

export default ProductDetail;
