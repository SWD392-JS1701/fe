import { API_URL } from "@/config";
import axios from "axios";
import {
  Order,
  CreateOrderRequest,
  CreateOrderDetailRequest,
  OrderDetail,
  UpdateOrderDetailRequest,
  UpdateOrderRequest,
} from "@/app/types/order";

export const getOrders = async (): Promise<Order[]> => {
  try {
    const response = await axios.get(`${API_URL}/order/orders`, {
      headers: {
        accept: "*/*",
      },
    });
    if (Array.isArray(response.data)) {
      return response.data as Order[];
    } else {
      console.warn("Unexpected response format:", response.data);
      return [];
    }
  } catch (error: any) {
    console.error("Error fetching orders:", error.message || error);
    throw new Error(error.response?.data?.message || "Failed to fetch orders");
  }
};

export const getOrderById = async (id: string): Promise<Order> => {
  try {
    const response = await axios.get(`${API_URL}/order/${id}`, {
      headers: {
        accept: "*/*",
      },
    });
    return response.data as Order;
  } catch (error: any) {
    console.error("Error fetching order:", error.message || error);
    throw new Error(error.response?.data?.message || "Failed to fetch order");
  }
};

export const createOrder = async (
  orderData: CreateOrderRequest
): Promise<Order> => {
  try {
    const response = await axios.post(`${API_URL}/order`, orderData, {
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    });
    return response.data as Order;
  } catch (error: any) {
    console.error("Error creating order:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error(error.response?.data?.message || "Failed to create order");
  }
};

export const updateOrder = async (id: string, updateData: UpdateOrderRequest): Promise<Order> => {
  try {
    const response = await axios.patch(`${API_URL}/order/${id}`, updateData, {
      headers: {
        accept: "*/*",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error updating order:", error.message || error);
    throw new Error(error.response?.data?.message || "Failed to update order");
  }
};

export const deleteOrder = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/order/${id}`, {
      headers: {
        accept: "*/*",
      },
    });
  } catch (error: any) {
    console.error("Error deleting order:", error.message || error);
    throw new Error(error.response?.data?.message || "Failed to delete order");
  }
};

export const getOrderDetails = async (): Promise<OrderDetail[]> => {
  try {
    const response = await axios.get(`${API_URL}/order-details`, {
      headers: {
        accept: "*/*",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching order details:", error.message || error);
    throw new Error(error.response?.data?.message || "Failed to fetch order details");
  }
};

export const getOrderDetailById = async (id: string): Promise<OrderDetail> => {
  try {
    const response = await axios.get(`${API_URL}/order-details/${id}`, {
      headers: {
        accept: "*/*",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching order detail:", error.message || error);
    throw new Error(error.response?.data?.message || "Failed to fetch order detail");
  }
};

export const getOrderDetailsByOrderId = async (orderId: string): Promise<OrderDetail[]> => {
  try {
    console.log("Calling API for order details with orderId:", orderId);
    const response = await axios.get(`${API_URL}/order-details/order/${orderId}`, {
      headers: {
        accept: "*/*",
      },
    });
    console.log("Raw API response:", response.data);
    
    // Check if response.data is the array directly
    if (Array.isArray(response.data)) {
      console.log("Response is an array, returning directly");
      return response.data;
    }
    
    // Check if response.data.orderDetails exists and is an array
    if (response.data && Array.isArray(response.data.orderDetails)) {
      console.log("Found orderDetails array in response");
      return response.data.orderDetails;
    }
    
    console.log("Unexpected response format:", response.data);
    return [];
  } catch (error: any) {
    console.error("Error fetching order details by order ID:", error.message || error);
    throw new Error(error.response?.data?.message || "Failed to fetch order details by order ID");
  }
};

export const createOrderDetail = async (orderDetailData: CreateOrderDetailRequest): Promise<OrderDetail> => {
  try {
    const response = await axios.post(`${API_URL}/order-details`, orderDetailData, {
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error creating order detail:", error.message || error);
    throw new Error(error.response?.data?.message || "Failed to create order detail");
  }
};

export const updateOrderDetail = async (id: string, orderDetailData: UpdateOrderDetailRequest): Promise<OrderDetail> => {
  try {
    const response = await axios.patch(`${API_URL}/order-details/${id}`, orderDetailData, {
      headers: {
        accept: "*/*",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error updating order detail:", error.message || error);
    throw new Error(error.response?.data?.message || "Failed to update order detail");
  }
};

export const deleteOrderDetail = async (id: string): Promise<OrderDetail> => {
  try {
    const response = await axios.delete(`${API_URL}/order-details/${id}`, {
      headers: {
        accept: "*/*",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error deleting order detail:", error.message || error);
    throw new Error(error.response?.data?.message || "Failed to delete order detail");
  }
};

export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
  try {
    const response = await axios.get(`${API_URL}/order/user/${userId}`, {
      headers: {
        accept: "*/*",
      },
    });
    if (response.data && Array.isArray(response.data.orders)) {
      return response.data.orders as Order[];
    } else {
      console.warn("Unexpected response format:", response.data);
      return [];
    }
  } catch (error: any) {
    console.error("Error fetching orders by user ID:", error.message || error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch orders by user ID"
    );
  }
};
