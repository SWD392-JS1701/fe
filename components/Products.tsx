"use client";

import React, { useState, useEffect } from "react";
import { getAllProducts, Product } from "@/app/services/productService";
import Link from "next/link";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getProducts = async () => {
      const data = await getAllProducts();
      setProducts(data);
      setLoading(false);
    };

    getProducts();
  }, []);

  return (
    <section id="products" className="container mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold text-purple-800 mb-12 text-center">
        Our Products
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading products...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <Link href={`/products/${product._id}`} key={product._id}>
                <div
                  key={product._id}
                  className="bg-white p-6 rounded-lg shadow-lg"
                >
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <h3 className="text-xl font-bold text-purple-800 mt-4">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mt-2">{product.description}</p>
                  <p className="text-gray-700 font-semibold mt-2">
                    ${product.price.toFixed(2)}
                  </p>
                  <button className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition duration-300">
                    Add to Cart
                  </button>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500">No products found.</p>
          )}
        </div>
      )}
    </section>
  );
};

export default Products;
