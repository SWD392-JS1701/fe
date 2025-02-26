"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductById, Product } from "@/app/services/productService";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
    <section className="container mx-auto px-6 py-16">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-96 object-cover"
        />
        <div className="p-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {product.name}
          </h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-2xl font-bold text-indigo-600 mb-4">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">Stock: {product.stock}</p>
          <p className="text-sm text-gray-500">Supplier: {product.Supplier}</p>
          <p className="text-sm text-gray-500">Volume: {product.volume} ml</p>
          <button className="mt-4 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700">
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
