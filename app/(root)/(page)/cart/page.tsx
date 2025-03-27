"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { updateQuantity, removeFromCart } from "@/lib/redux/cartSlice";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

import { Promotion } from "@/app/types/promotion";
import { createOrder, createOrderDetail } from "@/app/services/orderService";
import { createPayment } from "@/app/services/paymentService";
import { getPromotedProductByProductIdController } from "@/app/controller/promotionController";
import { getUserById } from "@/app/services/userService";
import { useSession } from "next-auth/react";
import { formatVND } from "@/app/utils/format";

const CartPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    null
  );
  const [discountedTotal, setDiscountedTotal] = useState(totalPrice);
  const shippingCost = 10.0;
  const totalCost = discountedTotal + shippingCost;
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const [userInfo, setUserInfo] = useState({
    fullname: "",
    telephone: "",
    address: "",
  });

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const allPromotions: Promotion[] = [];
        for (const item of cartItems) {
          const promotions = await getPromotedProductByProductIdController(
            item.id
          );
          console.log("Promotions:", promotions);
          if (promotions && promotions.length > 0) {
            promotions.forEach((promotion) => {
              if (!allPromotions.find((p) => p._id === promotion._id)) {
                allPromotions.push(promotion);
              }
            });
          }
        }
        setPromotions(allPromotions);
      } catch (error) {
        console.error("Error fetching promotions:", error);
      }
    };

    fetchPromotions();
  }, [cartItems]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session) {
        try {
          const userData = await getUserById(session);
          if (userData) {
            setUserInfo({
              fullname: `${userData.first_name || ""} ${
                userData.last_name || ""
              }`.trim(),
              telephone: userData.phone_number || "",
              address: userData.address || "",
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [session]);

  useEffect(() => {
    if (selectedPromotion) {
      const discount =
        (totalPrice * selectedPromotion.discount_percentage) / 100;
      setDiscountedTotal(totalPrice - discount);
    } else {
      setDiscountedTotal(totalPrice);
    }
  }, [selectedPromotion, totalPrice]);

  const [activeTab, setActiveTab] = useState<"summary" | "delivery">("summary");

  const handleUserInfoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setUserInfo((prev) => ({
      ...prev,
      telephone: value,
    }));
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleCheckout = async () => {
    if (!session?.user) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Please log in to checkout.",
        showConfirmButton: true,
      });
      router.push("/sign-in");
      return;
    }

    if (cartItems.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Cart Empty!",
        text: "Your cart is empty. Add items before checking out.",
        showConfirmButton: true,
      });
      return;
    }

    if (!userInfo.fullname || !userInfo.telephone || !userInfo.address) {
      Swal.fire({
        icon: "error",
        title: "Missing Information!",
        text: "Please fill in all delivery information fields.",
        showConfirmButton: true,
      });
      return;
    }

    setLoading(true);
    try {
      // Convert USD to VND (approximate rate) and ensure it's an integer
      const amountInVND = Math.round(totalCost * 100);
      console.log("Amount in USD:", totalCost);
      console.log("Amount in VND:", amountInVND);

      // Create order first
      const orderData = {
        user_Id: session.user.id,
        user_fullname: userInfo.fullname,
        user_telephone: userInfo.telephone,
        user_address: userInfo.address,
        amount: amountInVND,
      };
      const orderResponse = await createOrder(orderData);

      // Create order details
      const orderDetailData = {
        order_Id: orderResponse._id,
        product_List: cartItems.map((item) => ({
          name: item.name,
          product_Id: item.id,
          quantity: item.quantity,
        })),
      };
      await createOrderDetail(orderDetailData);

      // Create payment link with PayOS
      const paymentResponse = await createPayment(orderResponse._id);
      console.log("Payment Response:", paymentResponse);

      if (paymentResponse.checkoutUrl) {
        // Store orderCode in localStorage for verification
        localStorage.setItem(
          "lastOrderCode",
          paymentResponse.orderCode.toString()
        );
        // Redirect to PayOS checkout page
        window.location.href = paymentResponse.checkoutUrl;
      } else {
        throw new Error("Failed to create payment link");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text:
          error instanceof Error
            ? error.message
            : "Failed to process checkout. Please try again.",
        showConfirmButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (activeTab === "summary") {
      setActiveTab("delivery");
    } else {
      handleCheckout();
    }
  };

  const renderTabContent = () => {
    if (activeTab === "summary") {
      return (
        <div className="min-h-[300px]">
          <div className="flex justify-between mt-6 mb-5">
            <span className="font-bold text-lg uppercase">
              Items {totalItems}
            </span>
            <span className="font-semibold text-lg">
              {formatVND(totalPrice)}
            </span>
          </div>
          <div>
            <label className="font-bold inline-block mb-3 text-lg uppercase">
              Shipping
            </label>
            <Select defaultValue="standard">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select shipping method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">
                  Standard shipping - {formatVND(shippingCost)}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="py-10">
            <label
              htmlFor="promo"
              className="font-bold inline-block mb-3 text-lg uppercase"
            >
              Select Promotion
            </label>
            {promotions.length > 0 ? (
              <Select
                onValueChange={(value) => {
                  const selected = promotions.find(
                    (promo) => promo._id === value
                  );
                  setSelectedPromotion(selected || null);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a promotion" />
                </SelectTrigger>
                <SelectContent>
                  {promotions.map((promotion) => (
                    <SelectItem key={promotion._id} value={promotion._id}>
                      {promotion.title} - {promotion.discount_percentage}% off
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-gray-600">No promotions available.</p>
            )}
          </div>
          {selectedPromotion && (
            <div className="mb-4">
              <p className="text-green-600">
                Applied Promotion: {selectedPromotion.title} -{" "}
                {selectedPromotion.discount_percentage}% off
              </p>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Discount</span>
                <span>-{formatVND(totalPrice - discountedTotal)}</span>
              </div>
            </div>
          )}
          <div className="flex justify-between items-center font-bold text-lg">
            <span>Total</span>
            <span>{formatVND(discountedTotal)}</span>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-[300px] space-y-4 mt-6">
        <div>
          <label className="block text-lg font-bold text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="fullname"
            value={userInfo.fullname}
            onChange={handleUserInfoChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            placeholder="Enter full name"
          />
        </div>

        <div>
          <label className="block text-lg font-bold text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="telephone"
            value={userInfo.telephone}
            onChange={handlePhoneNumberChange}
            pattern="[0-9]*"
            inputMode="numeric"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            placeholder="Enter phone number (numbers only)"
            maxLength={15}
          />
        </div>

        <div>
          <label className="block text-lg font-bold text-gray-700 mb-1">
            Delivery Address
          </label>
          <input
            type="text"
            name="address"
            value={userInfo.address}
            onChange={handleUserInfoChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            placeholder="Enter delivery address"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto mt-10 pt-18">
      <Link
        href="/"
        className="flex font-semibold text-indigo-600 text-sm mt-10"
      >
        <svg
          className="fill-current mr-2 text-indigo-600 w-4"
          viewBox="0 0 448 512"
        >
          <path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" />
        </svg>
        Continue Shopping
      </Link>
      <div className="my-10 w-full max-w-2xl mx-auto relative">
        {/* Cart Items */}
        <div className="w-full max-w-3xl mx-auto bg-white px-6 py-6">
          <div className="flex justify-between border-b pb-4">
            <h1 className="font-bold text-3xl italic">YOUR CART</h1>
            <h2 className="font-bold text-3xl">{totalItems} ITEMS</h2>
          </div>

          {cartItems.length === 0 ? (
            <p className="text-center text-gray-600 py-10 text-xl font-bold">
              Your cart is empty.
            </p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start py-6 border-b border-gray-200"
              >
                {/* Product Image */}
                <div className="w-1/4">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-auto object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="w-3/4 pl-4 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <p className="text-xl font-bold">{item.name}</p>
                    <p className="text-xl font-bold">
                      {formatVND(item.price)}
                    </p>
                  </div>

                  {/* Quantity & Remove Button */}
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        className="px-4 py-2 text-xl text-gray-700 font-bold hover:bg-gray-200"
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-6 text-xl font-bold">
                        {item.quantity}
                      </span>
                      <button
                        className="px-4 py-2 text-xl text-gray-700 font-bold hover:bg-gray-200"
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="text-red-500 text-base font-bold hover:underline"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Summary */}
        <div id="summary" className="w-full max-w-2xl mx-auto px-8 mt-8">
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-5 px-6 text-center border-b-2 text-2xl font-bold italic ${
                activeTab === "summary"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("summary")}
            >
              ORDER SUMMARY
            </button>
            <button
              className={`flex-1 py-5 px-6 text-center border-b-2 text-2xl font-bold italic ${
                activeTab === "delivery"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("delivery")}
            >
              DELIVERY INFO
            </button>
          </div>

          {/* Tab Content */}
          {renderTabContent()}

          {/* Total and Next/Checkout Button */}
          <div className="border-t mt-8">
            <div className="flex font-bold justify-between py-6 text-lg uppercase">
              <span>Total cost</span>
              <span>{formatVND(totalCost)}</span>
            </div>
            <Button
              onClick={
                activeTab === "summary" ? handleNextStep : handleCheckout
              }
              disabled={loading}
              className={`bg-[#66FF80] rounded-md font-bold py-10 my-4 text-3xl text-black w-full border-2 border-[#66FF80] transition-all ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:border-black"
              }`}
            >
              {loading
                ? "Processing..."
                : activeTab === "summary"
                ? "Next"
                : "Checkout securely"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
