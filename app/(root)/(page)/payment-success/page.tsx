"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { checkPayment, getPaymentStatus } from "@/app/services/paymentService";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000; // 2 seconds

  const verifyPayment = async () => {
    try {
      const orderId = searchParams.get("orderId");
      const orderCode = searchParams.get("orderCode");

      if (!orderId || !orderCode) {
        throw new Error("Missing orderId or orderCode in URL parameters");
      }

      console.log(
        "Checking payment for order:",
        orderId,
        "orderCode:",
        orderCode
      );

      // First try to get status directly from PayOS
      try {
        const payosStatus = await getPaymentStatus(parseInt(orderCode));
        console.log("PayOS Status:", payosStatus);

        if (payosStatus.status === "PAID") {
          // Update our database with the PAID status
          await checkPayment(orderId, parseInt(orderCode));

          await Swal.fire({
            icon: "success",
            title: "Payment Successful!",
            text: "Your order has been confirmed.",
            confirmButtonText: "Continue Shopping",
          });
          router.push("/");
          return;
        }
      } catch (payosError) {
        console.error("Error getting PayOS status:", payosError);
      }

      // If PayOS status check fails or isn't PAID, check our database
      const dbStatus = await checkPayment(orderId, parseInt(orderCode));
      console.log("Database Status:", dbStatus);

      if (dbStatus.status === "PAID") {
        await Swal.fire({
          icon: "success",
          title: "Payment Successful!",
          text: "Your order has been confirmed.",
          confirmButtonText: "Continue Shopping",
        });
        router.push("/");
      } else if (dbStatus.status === "PENDING" && retryCount < MAX_RETRIES) {
        // Retry after delay
        setRetryCount((prev) => prev + 1);
        setTimeout(() => {
          verifyPayment();
        }, RETRY_DELAY);
      } else {
        throw new Error(
          `Payment verification failed. Status: ${dbStatus.status}`
        );
      }
    } catch (error) {
      console.error("Payment verification error:", error);

      if (retryCount < MAX_RETRIES) {
        // Retry after delay
        setRetryCount((prev) => prev + 1);
        setTimeout(() => {
          verifyPayment();
        }, RETRY_DELAY);
      } else {
        await Swal.fire({
          icon: "error",
          title: "Payment Verification Failed",
          text: "We couldn't verify your payment status. Please check your order status in your account or contact support.",
          confirmButtonText: "Check Orders",
        });
        router.push("/orders");
      }
    } finally {
      if (retryCount >= MAX_RETRIES) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    verifyPayment();
  }, [router, searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        <p className="mt-4 text-xl font-semibold">
          Verifying your payment...{" "}
          {retryCount > 0 ? `(Attempt ${retryCount}/${MAX_RETRIES})` : ""}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Button
        onClick={() => router.push("/orders")}
        className="mt-4 bg-green-500 hover:bg-green-600 text-white"
      >
        View Orders
      </Button>
    </div>
  );
}
