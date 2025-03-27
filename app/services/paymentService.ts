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
  transactions: any[];
}

export const createPayment = async (
  order_Id: string
): Promise<PaymentResponse> => {
  try {
    const response = await axios.post(`${API_URL}/payment/create`, {
      order_Id,
      status: 0, // Initial status for new payment
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
  orderCode: string
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
