import axios from "axios";
import { API_URL } from "@/config";

export interface PaymentResponse {
  bin: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  description: string;
  orderCode: number;
  currency: string;
  paymentLinkId: string;
  status: string;
  checkoutUrl: string;
  qrCode: string;
}

export interface PaymentStatusResponse {
  id: string;
  orderCode: number;
  amount: number;
  amountPaid: number;
  amountRemaining: number;
  status: string;
  canceledAt: string | null;
  cancellationReason: string | null;
  createdAt: string;
  transactions: Array<{
    id: string;
    amount: number;
    status: string;
    createdAt: string;
  }>;
}

export const createPayment = async (
  order_Id: string,
  amount: number,
  description: string
): Promise<PaymentResponse> => {
  try {
    // Generate a random 8-digit number for orderCode
    const orderCode = Math.floor(10000000 + Math.random() * 90000000);

    const response = await axios.post(`${API_URL}/payment/create`, {
      order_Id: order_Id,
      amount,
      description,
      orderCode,
      cancelUrl: `${window.location.origin}/cancel`,
      returnUrl: `${window.location.origin}/payment-success?orderId=${order_Id}`,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to create payment"
      );
    }
    throw error;
  }
};

export const getPaymentStatus = async (
  orderCode: number
): Promise<PaymentStatusResponse> => {
  try {
    const response = await axios.get(`${API_URL}/payment/${orderCode}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to get payment status"
      );
    }
    throw error;
  }
};

export const cancelPayment = async (
  order_Id: string,
  cancellationReason?: string
) => {
  try {
    const response = await axios.post(`${API_URL}/payment/payment-cancel`, {
      order_Id,
      cancellationReason,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to cancel payment"
      );
    }
    throw error;
  }
};
