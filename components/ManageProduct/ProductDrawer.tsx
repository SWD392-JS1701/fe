import React, { FC } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Product } from "@/app/types/product";
import { motion } from "framer-motion";
import { formatVND } from "@/app/utils/format";

interface ProductDrawerProps {
  product: Product;
  onClose: () => void;
}

const ProductDrawer: FC<ProductDrawerProps> = ({ product, onClose }) => {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  return (
    <>
      {/* Overlay with blur effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 backdrop-blur-md bg-white/30 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 w-full max-w-md bg-white h-full shadow-lg z-50 p-6 overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {product.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex items-center mb-4">
          <Image
            src={product.image_url}
            alt={product.name}
            width={80}
            height={80}
            className="rounded-lg mr-4"
          />
          <div>
            <p className="text-gray-800 font-medium">ID: {product._id}</p>
            <p className="text-gray-600">Rating: {product.product_rating}/5</p>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-600">
              PRODUCT INFO
            </h3>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Price</span>
                <span className="text-gray-800">
                  {formatVND(product.price)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Stock</span>
                <span className="text-gray-800">
                  {product.stock === 0
                    ? "Out of stock"
                    : product.stock <= 10
                    ? `${product.stock} left`
                    : product.stock}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Supplier</span>
                <span className="text-gray-800">
                  {product.Supplier || "N/A"}
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
                <span className="text-gray-800">{product.volume}</span>
              </div>
              {product.created_at && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Created At</span>
                  <span className="text-gray-800">
                    {formatDate(product.created_at)}
                  </span>
                </div>
              )}
              {product.updated_at && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Updated At</span>
                  <span className="text-gray-800">
                    {formatDate(product.updated_at)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ProductDrawer;
