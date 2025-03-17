"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/redux/store";
import {
  updateQuantity,
  removeFromCart,
  clearCart,
} from "@/lib/redux/cartSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { createOrder, createOrderDetail } from "@/app/services/orderService";
import { getUserById } from "@/app/services/userService";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button"; // Import shadcn Button component

const CartPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingCost = 10.0;
  const totalCost = totalPrice + shippingCost;
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  // Initialize userInfo with empty strings
  const [userInfo, setUserInfo] = useState({
    fullname: "",
    telephone: "",
    address: "",
  });

  // Update userInfo when session changes
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

  // Add state for active tab
  const [activeTab, setActiveTab] = useState<"summary" | "delivery">("summary");

  // Add state for promo code
  const [promoCode, setPromoCode] = useState("");

  // Handle user info changes
  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove any non-digit characters
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

    // Validate user information
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
      const paymentData = {
        user_Id: session.user.id,
        user_fullname: userInfo.fullname,
        user_telephone: userInfo.telephone,
        user_address: userInfo.address,
        amount: totalCost,
      };
      const paymentResponse = await createOrder(paymentData);
      const orderDetailData = {
        order_Id: paymentResponse._id,
        product_List: cartItems.map((item) => ({
          name: item.name,
          product_Id: item.id,
          quantity: item.quantity,
        })),
      };

      await createOrderDetail(orderDetailData);

      dispatch(clearCart());
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Order placed successfully! Payment processed.",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text:
          error.message ||
          "Failed to place order or process payment. Please try again.",
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
            <span className="font-semibold text-sm uppercase">
              Items {totalItems}
            </span>
            <span className="font-semibold text-sm">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
          <div>
            <label className="font-medium inline-block mb-3 text-sm uppercase">
              Shipping
            </label>
            <Select defaultValue="standard">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select shipping method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">
                  Standard shipping - $10.00
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="py-10">
            <label
              htmlFor="promo"
              className="font-semibold inline-block mb-3 text-sm uppercase"
            >
              Promo Code
            </label>
            <input
              type="text"
              id="promo"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter your code"
              className="p-2 text-sm w-full"
            />
          </div>
          <Button
            onClick={() => {
              // Handle promo code application here
              console.log("Applying promo code:", promoCode);
            }}
            className="bg-red-500 border rounded-md hover:bg-red-600 px-5 py-2 text-sm text-white uppercase mt-4"
          >
            Apply
          </Button>
        </div>
      );
    }

    return (
      <div className="min-h-[300px] space-y-4 mt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="fullname"
            value={userInfo.fullname}
            onChange={handleUserInfoChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="telephone"
            value={userInfo.telephone}
            onChange={handlePhoneNumberChange}
            pattern="[0-9]*"
            inputMode="numeric"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter phone number (numbers only)"
            maxLength={15}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Address
          </label>
          <input
            type="text"
            name="address"
            value={userInfo.address}
            onChange={handleUserInfoChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
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
      <div className="sm:flex shadow-md my-10">
        <div className="w-full sm:w-3/4 bg-white px-6 py-6">
          <div className="flex justify-between border-b pb-4">
            <h1 className="font-semibold text-2xl italic">YOUR BAG</h1>
            <h2 className="font-semibold text-2xl">{totalItems} ITEMS</h2>
          </div>

          {cartItems.length === 0 ? (
            <p className="text-center text-gray-600 py-10">
              Your cart is empty.
            </p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start py-6 border-b border-gray-200"
              >
                {/* Hình ảnh sản phẩm */}
                <div className="w-1/4">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-auto object-cover"
                  />
                </div>

                {/* Thông tin sản phẩm */}
                <div className="w-3/4 pl-4 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-lg font-semibold">{item.name}</p>
                    </div>
                    <p className="text-lg font-semibold">
                      £{item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Số lượng & nút xóa */}
                  <div className="flex items-center justify-between pt-4">
                    {/* Bộ đếm số lượng giống ảnh */}
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        className="px-3 py-1 text-gray-700 hover:bg-gray-200"
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-4 text-lg font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        className="px-3 py-1 text-gray-700 hover:bg-gray-200"
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="text-red-500 text-sm font-semibold hover:underline"
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

        <div id="summary" className="w-full sm:w-1/4 md:w-1/2 px-8">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === "summary"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("summary")}
            >
              Order Summary
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === "delivery"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("delivery")}
            >
              Delivery Info
            </button>
          </div>

          {/* Tab Content */}
          {renderTabContent()}

          {/* Total and Next/Checkout Button */}
          <div className="border-t mt-8">
            <div className="flex font-semibold justify-between py-6 text-sm uppercase">
              <span>Total cost</span>
              <span>${totalCost.toFixed(2)}</span>
            </div>
            <Button
              onClick={
                activeTab === "summary" ? handleNextStep : handleCheckout
              }
              disabled={loading}
              className={`bg-indigo-500 rounded-md font-semibold py-4 my-4 text-sm text-white uppercase w-full ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-indigo-600"
              }`}
            >
              {loading
                ? "Processing..."
                : activeTab === "summary"
                ? "Next"
                : "Checkout"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
