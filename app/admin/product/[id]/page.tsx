import React, { FC } from "react";
import { getProductById } from "@/app/services/productService";
import Image from "next/image";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

const ProductDetailPage: FC<ProductDetailPageProps> = async ({ params }) => {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return <div className="p-6">Product not found</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          {product.name}
        </h1>
        <div className="flex items-center mb-4">
          <Image
            src={product.image_url}
            alt={product.name}
            width={120}
            height={120}
            className="rounded-lg mr-4"
          />
          <div>
            <p className="text-gray-800 font-medium">ID: {product._id}</p>
            <p className="text-gray-600">Rating: {product.product_rating}/5</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-600">
              Product Details
            </h3>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Description</span>
                <span className="text-gray-800">{product.description}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price</span>
                <span className="text-gray-800">
                  ${product.price.toFixed(2)}
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
                <span className="text-gray-600">Product Type ID</span>
                <span className="text-gray-800">{product.product_type_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Supplier</span>
                <span className="text-gray-800">{product.Supplier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expired Date</span>
                <span className="text-gray-800">{product.expired_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Volume</span>
                <span className="text-gray-800">{product.volume}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created At</span>
                <span className="text-gray-800">{product.created_at}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Updated At</span>
                <span className="text-gray-800">{product.updated_at}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
