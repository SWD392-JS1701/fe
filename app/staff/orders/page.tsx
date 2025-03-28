"use client";

import React, { useEffect, useState, Fragment } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Order } from "@/app/types/order";
import { toast } from "react-hot-toast";
import Loading from "@/components/Loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatVND } from "@/app/utils/format";

import {
  getOrders,
  updateOrder,
  getOrderDetailsByOrderId,
} from "@/app/services/orderService";

interface OrderWithDetails extends Order {
  orderDetails?: {
    product_List: Array<{
      name: string;
      product_Id: string;
      quantity: number;
      _id?: string;
    }>;
  };
}

const StaffOrdersPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
      return;
    }

    if (session?.user?.role !== "Staff") {
      router.push("/");
      return;
    }

    fetchOrders();
  }, [session, status, router]);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: number) => {
    try {
      await updateOrder(orderId, { status: newStatus });
      toast.success("Order status updated successfully");
      fetchOrders();
    } catch (error: any) {
      toast.error(error.message || "Failed to update order status");
    }
  };

  const getStatusText = (status: number): string => {
    switch (status) {
      case 1:
        return "Completed";
      case 0:
        return "Pending";
      case 2:
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (status: number): string => {
    switch (status) {
      case 1:
        return "bg-green-100 text-green-800";
      case 0:
        return "bg-yellow-100 text-yellow-800";
      case 2:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === "all") return true;
    return order.status.toString() === filterStatus;
  });

  // Get current orders
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Change page
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setExpandedOrderId(null); // Close any expanded order when changing pages
  };

  const handleExpandOrder = async (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      return;
    }

    try {
      console.log("Fetching order details for order:", orderId);
      const orderDetails = await getOrderDetailsByOrderId(orderId);
      console.log("Received order details:", orderDetails);

      if (orderDetails && orderDetails.length > 0) {
        console.log(
          "Setting orders with details:",
          orderDetails[0].product_List
        );
        setOrders(
          orders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  orderDetails: { product_List: orderDetails[0].product_List },
                }
              : order
          )
        );
        setExpandedOrderId(orderId);
      } else {
        console.log("No order details found");
        toast.error("No order details found");
      }
    } catch (error) {
      console.error("Error in handleExpandOrder:", error);
      toast.error("Failed to fetch order details");
    }
  };

  const renderOrderDetails = (order: OrderWithDetails) => {
    console.log("Rendering products for order:", order._id);
    console.log("Order details:", order.orderDetails);

    return (
      expandedOrderId === order._id && (
        <tr className="bg-gray-50">
          <td colSpan={7} className="p-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold mb-2">Delivery Information</h4>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Full Name:</span>{" "}
                      {order.user_fullname}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {order.user_telephone}
                    </p>
                    <p>
                      <span className="font-medium">Address:</span>{" "}
                      {order.user_address}
                    </p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold mb-2">Order Details</h4>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Order ID:</span> {order._id}
                    </p>
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                    <p>
                      <span className="font-medium">Total Amount:</span>{" "}
                      {formatVND(order.amount)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold mb-2">Products</h4>
                {!order.orderDetails ? (
                  <p className="text-gray-500">Loading products...</p>
                ) : !order.orderDetails.product_List?.length ? (
                  <p className="text-gray-500">
                    No products found for this order.
                  </p>
                ) : (
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Product Name</th>
                        <th className="text-left py-2">Product ID</th>
                        <th className="text-right py-2">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.orderDetails.product_List.map((product, index) => {
                        console.log("Rendering product:", product);
                        return (
                          <tr key={index} className="border-b last:border-b-0">
                            <td className="py-2">{product.name}</td>
                            <td className="py-2">{product.product_Id}</td>
                            <td className="py-2 text-right">
                              {product.quantity}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </td>
        </tr>
      )
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <div className="flex gap-4">
          <Select
            value={filterStatus}
            onValueChange={(value) => {
              setFilterStatus(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="0">Pending</SelectItem>
              <SelectItem value="1">Completed</SelectItem>
              <SelectItem value="2">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              currentOrders.map((order) => (
                <Fragment key={order._id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button
                        onClick={() => handleExpandOrder(order._id)}
                        className="flex items-center space-x-2 hover:text-indigo-600"
                      >
                        <svg
                          className={`w-4 h-4 transform transition-transform ${
                            expandedOrderId === order._id ? "rotate-90" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                        <span>{order._id}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.user_Id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatVND(order.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Select
                        value={order.status.toString()}
                        onValueChange={(value) =>
                          handleStatusChange(order._id, parseInt(value))
                        }
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Pending</SelectItem>
                          <SelectItem value="1">Completed</SelectItem>
                          <SelectItem value="2">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                  {renderOrderDetails(order)}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-indigo-500 text-white hover:bg-indigo-600"
              }`}
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === index + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-indigo-500 text-white hover:bg-indigo-600"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffOrdersPage;
