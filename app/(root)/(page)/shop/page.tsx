"use client";

import React, { useEffect, useState } from "react";
import { getAllProducts } from "@/app/services/productService"; // Import hàm lấy sản phẩm từ API
import ProductCard from "@/components/ProductCard"; // Import ProductCard
import { Product } from "@/app/types/product";

const ShopPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getAllProducts();
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">All Products</h1>
        <p className="text-gray-600">Browse our collection of products</p>
      </div>

      {/* Main Content */}
      <div className="flex gap-8">
        {/* Items List */}
        <div className="w-full">
          {loading ? (
            <p className="text-center text-gray-500">Loading products...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <p className="text-center col-span-3 text-gray-500">
                  No products available.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
