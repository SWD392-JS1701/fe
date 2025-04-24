"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/app/types/product";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { addToCart, updateQuantity } from "@/lib/redux/cartSlice";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { formatVND } from "@/app/utils/format";
import Image from "next/image";

interface LetterProductCardProps {
  product: Product;
}

const LetterProductCard: React.FC<LetterProductCardProps> = ({ product }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart.items);
  const { data: session } = useSession();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      session?.user?.role === "Doctor" ||
      session?.user?.role === "Staff" ||
      session?.user?.role === "Admin"
    ) {
      toast.error("Not Allowed", {
        description: "Cannot add items to cart",
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
        description: "Product quantity updated in cart",
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
        description: "Product successfully added to cart",
      });
    }
  };

  return (
    <Link href={`/products/${product._id}`}>
      <div
        className="bg-[#f5e6d3] rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 border border-[#e5d5c5]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 29px, #e5d5c5 30px)",
          backgroundSize: "100% 30px",
        }}
      >
        <div className="relative overflow-hidden rounded-md mb-4 aspect-square">
          <Image
            src={product.image_url}
            alt={product.name}
            className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="space-y-2">
          <h3 className="font-cursive text-xl text-[#4a3e36]">
            {product.name}
          </h3>

          <p className="font-handwriting text-[#6b5d53] line-clamp-2 min-h-[2.5rem]">
            {product.description}
          </p>

          <div className="flex items-center justify-between mt-4">
            <span className="font-cursive text-xl text-[#4a3e36]">
              {formatVND(product.price)}
            </span>

            <button
              onClick={handleAddToCart}
              className="bg-[#4a3e36] text-[#f5e6d3] px-4 py-2 rounded-md font-handwriting hover:bg-[#6b5d53] transition-colors duration-300"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LetterProductCard;
