"use client";

import React, { useState, useEffect } from "react";
import { getAllProducts, Product } from "@/app/services/productService";
import ProductCard from "@/components/ProductCard";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getAllProducts();
      setProducts(data);
      setLoading(false);
    };

    fetchProducts();
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
              <ProductCard key={product._id} product={product} />
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
