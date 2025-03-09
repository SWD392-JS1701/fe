// pages/product/[id].tsx (or wherever ProductDetailPage is located)
import React, { FC } from "react";
import { getProductById } from "@/app/services/productService";
import Image from "next/image";
import Link from "next/link";
import ProductTabs from "@/components/ProductTabs"; // Adjust path as needed

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

const ProductDetailPage: FC<ProductDetailPageProps> = async ({ params }) => {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return (
      <div className="p-6 text-center text-red-600 bg-gray-100 min-h-screen">
        Product not found
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-500 flex items-center">
        <Link href="/admin/overview" className="hover:text-gray-700">
          Dashboard
        </Link>
        <span className="mx-2">{">"}</span>
        <Link href="/admin/product" className="hover:text-gray-700">
          Products
        </Link>
        <span className="mx-2">{">"}</span>
        <span className="text-blue-600">{product.name}</span>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Section: Status, Image, and Thumbnails */}
        <div className="space-y-6">
          {/* Status Indicators */}
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
              Active
            </span>
            <span className="px-3 py-1 text-xs font-semibold text-pink-800 bg-pink-100 rounded-full">
              On Sale
            </span>
          </div>

          {/* Main Product Image */}
          <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-md bg-white">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover w-full h-full"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Right Section: Product Details */}
        <div className="space-y-6">
          {/* Product Name, Rating, and Sales */}
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-yellow-500">
              ★ {product.product_rating} Rating
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-500">2.5K Reviews</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-500 flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              3560 Sold
            </span>
          </div>

          {/* Pricing */}
          <div className="space-y-2">
            <p className="text-green-600 font-semibold text-sm uppercase">
              Special Price
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-lg text-gray-500 line-through">
                ${(product.price * 1.2).toFixed(2)} {/* Example discount */}
              </span>
            </div>
          </div>

          {/* Offers */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700">
              Available Offers
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✔</span> Get extra $10.00 off
                (with special coupon code FEB2025)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✔</span> Special Price
                including 10% off (price inclusive of cashback) T&C
              </li>
            </ul>
          </div>

          {/* Stock Details */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700">Stock Details</p>
            <p className="text-sm text-gray-600">
              {product.stock === 0
                ? "Out of stock"
                : product.stock <= 10
                ? `${product.stock} left`
                : `${product.stock} in stock`}
            </p>
          </div>

          {/* Tabbed Section */}
          <ProductTabs product={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
