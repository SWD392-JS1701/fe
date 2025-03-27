"use client";

import React, { useEffect, useState } from "react";

import Loading from "@/components/Loading";
import { toast } from "react-hot-toast";

import { Order } from "@/app/types/order";
import { Product } from "@/app/types/product";
import { OrderDetail } from "@/app/types/order";
import {
  fetchAllOrders,
  fetchAllOrderDetails,
} from "@/app/controller/orderController";
import { fetchAllProducts } from "@/app/controller/productController";

const AdminPage = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, productsData, orderDetailsData] = await Promise.all([
          fetchAllOrders(),
          fetchAllProducts(),
          fetchAllOrderDetails(),
        ]);
        setOrders(ordersData);
        setProducts(productsData);
        setOrderDetails(orderDetailsData);
      } catch (error) {
        toast.error("Failed to fetch dashboard data");
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate dashboard metrics
  const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
  const totalOrders = orders.length;
  const successOrders = orders.filter((order) => order.status === 1).length;
  const pendingOrders = orders.filter((order) => order.status === 0).length;

  // Get recent transactions (last 5 orders)
  const recentTransactions = orders
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  // Get product stock information
  const productStock = products.map((product) => ({
    name: product.name,
    quantity: product.stock,
  }));

  // Calculate best selling items
  const bestSellingItems = products
    .map((product) => {
      const totalSold = orderDetails.reduce((sum, detail) => {
        const productInOrder = detail.product_List.find(
          (item) => item.product_Id === product._id
        );
        return sum + (productInOrder?.quantity || 0);
      }, 0);

      return {
        name: product.name,
        totalSold,
      };
    })
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, 5);

  if (loading) {
    return <Loading />;
  }

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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
            <h2 className="text-gray-500 text-sm">Total Revenue</h2>
            <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
            <p className="text-green-500 text-sm">
              ↑ {((successOrders / totalOrders) * 100).toFixed(1)}%
            </p>
            <p className="text-gray-500 text-sm">Success Rate</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-gray-500 text-sm">Total Orders</h2>
            <p className="text-2xl font-bold">{totalOrders}</p>
            <p className="text-blue-500 text-sm">{pendingOrders} Pending</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-gray-500 text-sm">Success Rate</h2>
            <p className="text-2xl font-bold">
              {((successOrders / totalOrders) * 100).toFixed(1)}%
            </p>
            <p className="text-green-500 text-sm">{successOrders} Completed</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Transaction Activity Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Best Selling Items</h2>
              <div className="space-y-4">
                {bestSellingItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-2/3">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-sm text-gray-500">
                          {item.totalSold} units
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{
                            width: `${
                              (item.totalSold / bestSellingItems[0].totalSold) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Transaction Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th>Order ID</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((order) => (
                    <tr key={order._id} className="border-b">
                      <td className="py-4">{order._id.slice(-6)}</td>
                      <td>${order.amount.toFixed(2)}</td>
                      <td
                        className={
                          order.status === 1
                            ? "text-green-500"
                            : "text-yellow-500"
                        }
                      >
                        {order.status === 1 ? "Completed" : "Pending"}
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column (1/3 width) */}
          <div className="space-y-6">
            {/* Total All Stock Product Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Product Stock</h2>
              <div className="space-y-4 max-h-[650px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {productStock.map((product, index) => (
                  <div key={index} className="flex justify-between">
                    <p>{product.name}</p>
                    <p className="text-gray-500">{product.quantity} items</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
