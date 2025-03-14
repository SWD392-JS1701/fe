"use client";

import React, { FC, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Loading from "@/components/Loading";
import OrderDetailModal from "@/components/UserProfile/OrderDetailModal";

import {
  getOrdersByUserId,
  getOrderDetailsByOrderId,
} from "@/app/services/orderService";
import { Order, OrderDetail } from "@/app/types/order";

interface User {
  id: string;
}

const ViewOrderPage: FC<{ user: User }> = ({ user }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderDetailsMap, setOrderDetailsMap] = useState<
    Map<string, OrderDetail[]>
  >(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) {
        setError("User ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const data = await getOrdersByUserId(user.id);
        setOrders(data);
        const detailsPromises = data.map(async (order) => {
          const details = await getOrderDetailsByOrderId(order._id);
          return { orderId: order._id, details };
        });
        const detailsResults = await Promise.all(detailsPromises);
        const newOrderDetailsMap = new Map<string, OrderDetail[]>();
        detailsResults.forEach(({ orderId, details }) => {
          newOrderDetailsMap.set(orderId, details);
        });
        setOrderDetailsMap(newOrderDetailsMap);
      } catch (err: any) {
        setError(err.message || "Failed to fetch orders.");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user.id]);

  const getStatusText = (status: number): string => {
    switch (status) {
      case 1:
        return "completed";
      case 0:
        return "pending";
      case 2:
        return "cancelled";
      default:
        return "unknown";
    }
  };

  const getStatusVariant = (
    status: number
  ): {
    variant: "default" | "secondary" | "destructive" | "outline";
    className: string;
  } => {
    switch (status) {
      case 1:
        return {
          variant: "default" as const,
          className: "bg-green-500 hover:bg-green-600",
        };
      case 0:
        return {
          variant: "secondary" as const,
          className: "bg-yellow-500 hover:bg-yellow-600",
        };
      case 2:
        return {
          variant: "destructive" as const,
          className: "bg-red-500 hover:bg-red-600",
        };
      default:
        return { variant: "default" as const, className: "" };
    }
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (loading) return <Loading />;
  if (error) {
    toast.error("Error", { description: error });
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-lg">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-2xl font-bold text-blue-800">
            Order History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="font-semibold text-gray-700">
                  No.
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Date
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Status
                </TableHead>
                <TableHead className="text-right font-semibold text-gray-700">
                  Total
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-gray-500 py-4"
                  >
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order, index) => {
                  return (
                    <TableRow
                      key={order._id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleOrderClick(order)}
                    >
                      <TableCell className="font-medium text-gray-800">
                        {index + 1}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusVariant(order.status).variant}
                          className={getStatusVariant(order.status).className}
                        >
                          {getStatusText(order.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-gray-800">
                        ${order.amount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <OrderDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        order={selectedOrder}
        orderDetail={orderDetailsMap.get(selectedOrder?._id || "")?.[0] || null}
      />
    </div>
  );
};

export default ViewOrderPage;
