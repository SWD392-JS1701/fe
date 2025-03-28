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
  order_Id: string;
  orderCode: number;
  amount: number;
  amountPaid: number;
  amountRemaining: number;
  status: string;
  createdAt: string;
  transactions: Array<{
    reference: string;
    amount: number;
    accountNumber: string;
    description: string;
    transactionDateTime: string;
    virtualAccountName?: string;
    virtualAccountNumber?: string;
    counterAccountBankId?: string;
    counterAccountBankName?: string;
    counterAccountName?: string;
    counterAccountNumber?: string;
  }>;
  cancellationReason?: string;
  canceledAt?: string;
}

export const createPayment = async (
  order_Id: string,
  amount: number,
  description: string
): Promise<{ payment: PaymentResponse; status: PaymentStatusResponse }> => {
  try {
    // Generate a random 8-digit number for orderCode
    const orderCode = Math.floor(10000000 + Math.random() * 90000000);

    const paymentData = {
      order_Id,
      amount,
      description,
      orderCode,
      cancelUrl: `${window.location.origin}/cancel`,
      returnUrl: `${window.location.origin}/payment-success?orderId=${order_Id}&orderCode=${orderCode}`,
    };

    console.log("Payment Request Data:", JSON.stringify(paymentData, null, 2));

    const response = await axios.post(
      `${API_URL}/payment/create`,
      paymentData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Payment Response:", response.data);

    // Check initial payment status using orderCode
    const statusResponse = await getPaymentStatus(orderCode);
    console.log("Initial Payment Status:", statusResponse);

    return {
      payment: response.data,
      status: statusResponse,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Payment Error Response:", error.response?.data);
      console.error("Full error:", error);
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
    const response = await axios.get(`${API_URL}/payment/payment/${orderCode}`);
    console.log("PayOS Status Response:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error getting payment status:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Failed to get payment status"
      );
    }
    throw error;
  }
};

export const checkPayment = async (
  orderId: string,
  orderCode?: number
): Promise<PaymentStatusResponse> => {
  try {
    // First get the latest status from PayOS if orderCode is provided
    let payosStatus;
    if (orderCode) {
      try {
        payosStatus = await getPaymentStatus(orderCode);
        console.log("Latest PayOS Status:", payosStatus);
      } catch (error) {
        console.error("Error getting PayOS status:", error);
      }
    }

    // Then update the status in our database
    const response = await axios.post(
      `${API_URL}/payment/check/${orderId}`,
      payosStatus ? { status: payosStatus.status } : undefined
    );

    console.log("Database Status Update Response:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error checking payment:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Failed to check payment"
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
