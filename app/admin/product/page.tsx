"use client";

import React, { FC, useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Product } from "@/app/types/product";
import { getAllProducts, deleteProduct } from "@/app/services/productService";
import { AnimatePresence } from "framer-motion";
import ProductDrawer from "@/components/ProductDrawer";

const ProductsPage: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const itemsPerPage = 6;

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await getAllProducts();
      setProducts(fetchedProducts);
    };
    fetchProducts();
  }, []);

  // Filter and search products
  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, products]);

  // Pagination logic
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Handle pagination
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Open off-canvas drawer
  const openDrawer = (product: Product) => {
    setSelectedProduct(product);
  };

  // Close off-canvas drawer
  const closeDrawer = () => {
    setSelectedProduct(null);
  };

  // Delete product
  const handleDelete = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(productId);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );
      if (selectedProduct && selectedProduct._id === productId) {
        closeDrawer();
      }
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Product Inventory ({totalItems} products)
            </h1>
            <p className="text-sm text-gray-500">
              All products ({totalItems} items)
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <svg
                className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm">
                <th className="p-3">Product</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Supplier</th>
                <th className="p-3">Expired Date</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr key={product._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 flex items-center space-x-3">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="rounded-lg"
                    />
                    <div>
                      <Link href={`/admin/products/${product._id}`}>
                        <p className="text-gray-800 font-medium hover:text-blue-600 hover:underline">
                          {product.name}
                        </p>
                      </Link>
                      <p className="text-gray-500 text-sm">ID: {product._id}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <p className="text-gray-800">${product.price.toFixed(2)}</p>
                  </td>
                  <td className="p-3">
                    <p className="text-gray-800">
                      {product.stock === 0
                        ? "Out of stock"
                        : product.stock <= 10
                        ? `${product.stock} left`
                        : product.stock}
                    </p>
                  </td>
                  <td className="p-3">
                    <p className="text-gray-800">{product.Supplier}</p>
                  </td>
                  <td className="p-3">
                    <p className="text-gray-800">{product.expired_date}</p>
                  </td>
                  <td className="p-3">
                    <p className="text-gray-800">{product.product_rating}/5</p>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center items-center space-x-2 h-full">
                      <button
                        onClick={() => openDrawer(product)}
                        className="text-gray-600 hover:text-gray-800"
                        aria-label="View product details"
                      >
                        <Eye size={16} />
                      </button>
                      <Link href={`/admin/products/edit/${product._id}`}>
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          aria-label="Edit product"
                        >
                          <Pencil size={16} />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-800"
                        aria-label="Delete product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
            {totalItems} entries
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-lg disabled:opacity-50"
            >
              {"<<"}
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-lg disabled:opacity-50"
            >
              {"<"}
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 border rounded-lg ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-600"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-lg disabled:opacity-50"
            >
              {">"}
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-lg disabled:opacity-50"
            >
              {">>"}
            </button>
          </div>
        </div>
      </div>

      {/* Render Product Drawer */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDrawer product={selectedProduct} onClose={closeDrawer} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsPage;
