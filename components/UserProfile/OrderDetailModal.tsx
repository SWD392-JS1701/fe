import React, { FC, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Order, OrderDetail } from "@/app/types/order";
import { getOrderDetailsByOrderId } from "@/app/services/orderService";
import { Loader2 } from "lucide-react";

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  orderDetail: OrderDetail | null;
}

const OrderDetailModal: FC<OrderDetailModalProps> = ({
  isOpen,
  onClose,
  order,
  orderDetail,
}) => {
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!order?._id) return;

      setLoading(true);
      setError(null);

      try {
        const details = await getOrderDetailsByOrderId(order._id);
        setOrderDetails(details);
      } catch (err: any) {
        setError(err.message || "Failed to fetch order details");
        console.error("Error fetching order details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && order && !orderDetail) {
      fetchOrderDetails();
    } else if (orderDetail) {
      setOrderDetails([orderDetail]); // Use the passed orderDetail if provided
    }
  }, [isOpen, order, orderDetail]);

  if (!order) return null;

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

  const currentOrderDetails = orderDetail ? [orderDetail] : orderDetails;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Order Details
          </DialogTitle>
          <DialogDescription>
            Order ID: {order._id} - Details of the products in this order.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Order Date:</p>
            <p className="font-medium">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-gray-600">Status:</p>
            <Badge
              variant={getStatusVariant(order.status).variant}
              className={getStatusVariant(order.status).className}
            >
              {getStatusText(order.status)}
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-gray-600">Total Amount:</p>
            <p className="font-medium text-lg">${order.amount.toFixed(2)}</p>
          </div>

          <div className="mt-4">
            <h3 className="font-medium text-gray-800 mb-2">Products</h3>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">{error}</div>
            ) : currentOrderDetails.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No product details found for this order.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-medium">Product Name</TableHead>
                    <TableHead className="font-medium text-right">
                      Quantity
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentOrderDetails.flatMap((detail) =>
                    detail.product_List.map((product, index) => (
                      <TableRow key={`${detail._id}-${index}`}>
                        <TableCell className="font-medium">
                          {product.name || "Unnamed Product"}
                        </TableCell>
                        <TableCell className="text-right">
                          {product.quantity}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;
