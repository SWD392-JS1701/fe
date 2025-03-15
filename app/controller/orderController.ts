import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderDetails,
  getOrderDetailById,
  getOrderDetailsByOrderId,
  createOrderDetail,
  updateOrderDetail,
  deleteOrderDetail,
  getOrdersByUserId,
} from "@/app/services/orderService";
import { toast } from "react-hot-toast";
import {
  Order,
  CreateOrderRequest,
  CreateOrderDetailRequest,
  OrderDetail,
} from "@/app/types/order";

export const fetchAllOrders = async (): Promise<Order[]> => {
  try {
    const orders = await getOrders();
    return orders;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const fetchOrderById = async (id: string): Promise<Order> => {
  try {
    const order = await getOrderById(id);
    return order;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const createNewOrder = async (
  orderData: CreateOrderRequest
): Promise<Order> => {
  try {
    const newOrder = await createOrder(orderData);
    toast.success("Order created successfully!");
    return newOrder;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const updateExistingOrder = async (
  id: string,
  order: Order
): Promise<Order> => {
  try {
    const updatedOrder = await updateOrder(id, order);
    toast.success("Order updated successfully!");
    return updatedOrder;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const deleteExistingOrder = async (id: string): Promise<void> => {
  try {
    await deleteOrder(id);
    toast.success("Order deleted successfully!");
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const fetchAllOrderDetails = async (): Promise<OrderDetail[]> => {
  try {
    const orderDetails = await getOrderDetails();
    return orderDetails;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const fetchOrderDetailById = async (
  id: string
): Promise<OrderDetail> => {
  try {
    const orderDetail = await getOrderDetailById(id);
    return orderDetail;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const fetchOrderDetailsByOrderId = async (
  orderId: string
): Promise<OrderDetail[]> => {
  try {
    const orderDetails = await getOrderDetailsByOrderId(orderId);
    return orderDetails;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const createNewOrderDetail = async (
  orderDetailData: CreateOrderDetailRequest
): Promise<OrderDetail> => {
  try {
    const newOrderDetail = await createOrderDetail(orderDetailData);
    toast.success("Order detail created successfully!");
    return newOrderDetail;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const updateExistingOrderDetail = async (
  id: string,
  orderDetail: OrderDetail
): Promise<OrderDetail> => {
  try {
    const updatedOrderDetail = await updateOrderDetail(id, orderDetail);
    toast.success("Order detail updated successfully!");
    return updatedOrderDetail;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const deleteExistingOrderDetail = async (id: string): Promise<void> => {
  try {
    await deleteOrderDetail(id);
    toast.success("Order detail deleted successfully!");
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const fetchOrdersByUserId = async (userId: string): Promise<Order[]> => {
  try {
    const orders = await getOrdersByUserId(userId);
    return orders;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};
