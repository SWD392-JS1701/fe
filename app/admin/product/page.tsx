"use client";

import React, { FC, useState, useMemo } from "react";
import Image from "next/image";
import { Eye, Pencil, Trash2, X } from "lucide-react";
import { fakeProducts } from "@/app/data/fakeProducts";
import { ProductSample } from "@/app/types/sample";
import { motion, AnimatePresence } from "framer-motion";

const ProductsPage: FC = () => {
  const [products, setProducts] = useState<ProductSample[]>(fakeProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<ProductSample | null>(
    null
  );
  const itemsPerPage = 6;

  // Filter and search products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || product.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, products]);

  // Pagination logic
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Toggle product status
  const toggleStatus = (id: string) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id
          ? {
              ...product,
              status: product.status === "Active" ? "Inactive" : "Active",
            }
          : product
      )
    );
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Open off-canvas drawer
  const openDrawer = (product: ProductSample) => {
    setSelectedProduct(product);
  };

  // Close off-canvas drawer
  const closeDrawer = () => {
    setSelectedProduct(null);
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
              All top performing product {totalItems} items
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
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm">
                <th className="p-3">Product</th>
                <th className="p-3">Category</th>
                <th className="p-3">Order/Stock</th>
                <th className="p-3">Price/Discount</th>
                <th className="p-3">Sales</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr key={product.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 flex items-center space-x-3">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="rounded-lg"
                    />
                    <div>
                      <p className="text-gray-800 font-medium">
                        {product.name}
                      </p>
                      <p className="text-gray-500 text-sm">ID: {product.id}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <p className="text-gray-800">{product.category}</p>
                    <p className="text-gray-500 text-sm">
                      {product.subCategory}
                    </p>
                  </td>
                  <td className="p-3">
                    <p className="text-gray-800">{product.order}</p>
                    <p className="text-gray-500 text-sm">
                      {product.stock === 0
                        ? "0 - empty"
                        : product.stock > 0 && product.stock <= 10
                        ? `${product.stock} Left`
                        : product.stock}
                    </p>
                  </td>
                  <td className="p-3">
                    <p className="text-gray-800">${product.price.toFixed(2)}</p>
                    <p className="text-gray-500 text-sm">
                      ${product.discount.toFixed(2)}, {product.discount}%
                    </p>
                  </td>
                  <td className="p-3">
                    <p className="text-gray-800">{product.sales}</p>
                    <p className="text-gray-500 text-sm">
                      {product.salesDuration}
                    </p>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => toggleStatus(product.id)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        product.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.status}
                    </button>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center items-center space-x-2 h-full">
                      <button
                        onClick={() => openDrawer(product)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <Eye size={16} />
                      </button>
                      <button className="text-blue-600 hover:text-blue-800">
                        <Pencil size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
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

      {/* Off-Canvas Drawer */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={closeDrawer}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 w-100 bg-white h-full shadow-lg z-50 p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                  <button className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100">
                    Edit
                  </button>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {selectedProduct.name}
                  </h2>
                </div>
                <button
                  onClick={closeDrawer}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex items-center mb-4">
                <Image
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  width={80}
                  height={80}
                  className="rounded-lg mr-4"
                />
                <div>
                  <p className="text-gray-800 font-medium">
                    ID: {selectedProduct.id}
                  </p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedProduct.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedProduct.status}
                  </span>
                  <p className="text-blue-600 text-sm mt-1">
                    {selectedProduct.orders} Orders
                  </p>
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
                      <span className="text-gray-600">Category</span>
                      <span className="text-gray-800">
                        {selectedProduct.category} →{" "}
                        {selectedProduct.subCategory}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID/SKU</span>
                      <span className="text-gray-800">
                        {selectedProduct.id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Orders/Stock</span>
                      <span className="text-gray-800">
                        {selectedProduct.order} /{" "}
                        {selectedProduct.stock === 0
                          ? "0 - empty"
                          : selectedProduct.stock > 0 &&
                            selectedProduct.stock <= 10
                          ? `${selectedProduct.stock} left`
                          : selectedProduct.stock}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price</span>
                      <span className="text-gray-800">
                        ${selectedProduct.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount</span>
                      <span className="text-gray-800">
                        ${selectedProduct.discount.toFixed(2)} with COUPON{" "}
                        {selectedProduct.discount}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Sales</span>
                      <span className="text-gray-800">
                        {selectedProduct.sales}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status</span>
                      <button
                        onClick={() => toggleStatus(selectedProduct.id)}
                        className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 ${
                          selectedProduct.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        <span>{selectedProduct.status}</span>
                        <svg
                          className={`w-4 h-4 ${
                            selectedProduct.status === "Active"
                              ? "text-green-800"
                              : "text-red-800"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={
                              selectedProduct.status === "Active"
                                ? "M5 13l4 4L19 7"
                                : "M6 18L18 6M6 6l12 12"
                            }
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsPage;
