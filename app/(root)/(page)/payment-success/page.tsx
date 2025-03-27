"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getPaymentStatus } from "@/app/services/paymentService";
import { useDispatch } from "react-redux";
import { clearCart } from "@/lib/redux/cartSlice";
import Link from "next/link";

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // Get orderCode from URL query parameters
        const orderCode = searchParams.get("orderCode");
        console.log("OrderCode from URL:", orderCode);

        if (!orderCode) {
          setStatus("error");
          setError("Order code not found in URL");
          return;
        }

        const paymentStatus = await getPaymentStatus(orderCode);
        console.log("Payment Status Response:", paymentStatus);

        // Check if payment is completed based on amountPaid
        if (
          paymentStatus.status === "PAID" ||
          paymentStatus.amountPaid === paymentStatus.amount
        ) {
          setStatus("success");
          dispatch(clearCart());
        } else if (paymentStatus.status === "PENDING") {
          setStatus("error");
          setError("Payment is still pending. Please complete the payment.");
        } else {
          setStatus("error");
          setError("Payment was not completed successfully. Please try again.");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("error");
        setError(
          error instanceof Error
            ? error.message
            : "An error occurred while checking payment status"
        );
      }
    };

    checkPaymentStatus();
  }, [searchParams, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {status === "loading" && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-xl font-semibold">Verifying payment...</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Payment Successful!
            </h2>
            <p className="mt-2 text-gray-600">Thank you for your purchase.</p>
            <div className="mt-6 space-y-3">
              <Link
                href="/"
                className="block w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-md font-semibold hover:bg-gray-300 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Payment Status
            </h2>
            <p className="mt-2 text-red-600">{error}</p>
            <div className="mt-6 space-y-3">
              <Link
                href="/cart"
                className="block w-full bg-indigo-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-indigo-700 transition-colors"
              >
                Return to Cart
              </Link>
              <Link
                href="/"
                className="block w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-md font-semibold hover:bg-gray-300 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
