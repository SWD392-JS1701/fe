"use client";

import React from "react";
import { useSession } from "next-auth/react";

const AdminPage = () => {
  const totalStockProducts = [
    { name: "T-Shirts", quantity: 1200 },
    { name: "Jeans", quantity: 850 },
    { name: "Shoes", quantity: 500 },
    { name: "Accessories", quantity: 300 },
  ];

  const { data: session } = useSession();

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-6 mt-30">
        {/* Header */}
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Overview</h1>
            <p className="text-gray-600">
              Monitor every activity of your company
            </p>
          </div>

          {/* Search Bar and Filter Button */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <span>Filter</span>
            </button>
          </div>
        </header>

        {/* Total Balance Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-gray-500 text-sm">
              Total Balance Your Company
            </h2>
            <p className="text-2xl font-bold">$124,254.62</p>
            <p className="text-green-500 text-sm">↑ 8.2%</p>
            <p className="text-gray-500 text-sm">Compare from last year</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-gray-500 text-sm">Total Income</h2>
            <p className="text-2xl font-bold">$265,172</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-gray-500 text-sm">Total Expense</h2>
            <p className="text-2xl font-bold">$98,284</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Transaction Activity Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Transaction Activity</h2>
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-600">Total Transaction</p>
                <p className="text-gray-600">Success Transaction</p>
              </div>
              <div className="h-48 bg-gray-50 rounded-lg p-4">
                {/* Placeholder for Chart */}
                <div className="flex justify-between h-full">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="w-8 bg-blue-200 rounded-t-lg"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Transaction Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Recent Transaction</h2>
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th>ID Transaction</th>
                    <th>Product</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-4">476 - 893</td>
                    <td>Premium T-Shirt</td>
                    <td className="text-green-500">Success</td>
                    <td>$24.51</td>
                    <td>
                      <button className="text-blue-500">View</button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4">476 - 892</td>
                    <td>Maxim Polo New</td>
                    <td className="text-yellow-500">Pending</td>
                    <td>$14.54</td>
                    <td>
                      <button className="text-blue-500">View</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column (1/3 width) */}
          <div className="space-y-6">
            {/* Total All Stock Product Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">
                Total All Stock Product
              </h2>
              <div className="space-y-4">
                {totalStockProducts.map((product, index) => (
                  <div key={index} className="flex justify-between">
                    <p>{product.name}</p>
                    <p className="text-gray-500">{product.quantity} items</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Employees Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Top Employees</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p>Alexander Munie</p>
                  <p className="text-gray-500">Sales 98 Product</p>
                </div>
                <div className="flex justify-between">
                  <p>Dianne Russell</p>
                  <p className="text-gray-500">Sales 90 Product</p>
                </div>
                <div className="flex justify-between">
                  <p>Marvin McKinney</p>
                  <p className="text-gray-500">Sales 82 Product</p>
                </div>
                <div className="flex justify-between">
                  <p>Brooklyn Simmons</p>
                  <p className="text-gray-500">Sales 76 Product</p>
                </div>
                <div className="flex justify-between">
                  <p>B5</p>
                  <p className="text-gray-500">Sales 78 Product</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
