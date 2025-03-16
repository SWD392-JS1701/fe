"use client";

import React, { FC, MouseEvent } from "react";
import Link from "next/link";

import { Product } from "../app/types/product";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { addToCart, updateQuantity } from "@/lib/redux/cartSlice";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart.items);
  const { data: session } = useSession();

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is a doctor
    if (session?.user?.role === "Doctor"
      ||session?.user?.role === "Staff"
      ||session?.user?.role === "Admin"
    ) {
      toast.error("Not Allowed", {
        description: "Cant add items to cart"
      });
      return;
    }

    const existingProduct = cart.find((item) => item.id === product._id);
    if (existingProduct) {
      dispatch(
        updateQuantity({
          id: product._id,
          quantity: existingProduct.quantity + 1,
        })
      );
      toast.success("Cart Updated", {
        description: "Product quantity updated in cart"
      });
    } else {
      dispatch(
        addToCart({
          id: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image_url: product.image_url,
        })
      );
      toast.success("Added to Cart", {
        description: "Product successfully added to cart"
      });
    }
  };

  return (
    <Link href={`/products/${product._id}`} key={product._id}>
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition duration-300">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-indigo-600 opacity-75"></div>
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-64 object-cover object-center relative z-10"
          />
          <div className="absolute top-4 right-4 bg-gray-100 text-xs font-bold px-3 py-2 rounded-full z-20 transform rotate-12">
            NEW
          </div>
        </div>
        <div className="p-6 flex flex-col justify-between h-[250px]">
          <div>
            <h3 className="text-2xl font-extrabold text-gray-800 mb-2">
              {product.name}
            </h3>
            <p className="text-gray-600 line-clamp-3">{product.description}</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-black">
                ${product.price.toFixed(2)}
              </span>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-yellow-500 text-2xl font-semibold">
                ⭐ {product.product_rating.toFixed(1)}
              </span>
              <span className="text-gray-600 text-lg ml-3">
                (Customer Reviews)
              </span>
              </div>
            </div>

            <button
              className="w-full border-2 border-black bg-white text-black font-bold py-3 px-4 rounded-lg transition duration-200 ease-in-out 
             hover:bg-black hover:text-white cursor-pointer"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
