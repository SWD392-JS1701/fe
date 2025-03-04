"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { updateQuantity, removeFromCart } from "@/lib/redux/cartSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleUpdateQuantity = (id: string, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

  return (
    <>
      <div className="container mx-auto mt-10 bg-pink-50">
        <div className="sm:flex shadow-md my-10">
          <div className="w-full sm:w-3/4 bg-pink-50 px-10 py-10">
            <div className="flex justify-between border-b pb-8">
              <h1 className="font-semibold text-2xl">Shopping Cart</h1>
              <h2 className="font-semibold text-2xl">{totalItems} Items</h2>
            </div>

            {/* Map through cart items and display them */}
            {cartItems.length === 0 ? (
              <p className="text-center text-gray-600 py-10">
                Your cart is empty.
              </p>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="md:flex items-strech py-8 md:py-10 lg:py-8 border-t border-gray-50"
                >
                  <div className="md:w-4/12 2xl:w-1/4 w-full">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full object-center object-cover md:block hidden"
                    />
                    <img
                      src="https://i.ibb.co/TTnzMTf/Rectangle-21.png"
                      alt={item.name}
                      className="md:hidden w-full h-full object-center object-cover"
                    />
                  </div>
                  <div className="md:pl-3 md:w-8/12 2xl:w-3/4 flex flex-col justify-center">
                    <div className="flex items-center justify-between w-full">
                      <p className="text-base font-black leading-none text-gray-800">
                        {item.name}
                      </p>
                      <select
                        aria-label="Select quantity"
                        className="py-2 px-1 border border-gray-200 mr-6 focus:outline-none"
                        value={item.quantity}
                        onChange={(e) => {
                          handleUpdateQuantity(item.id, +e.target.value);
                        }}
                      >
                        {[...Array(10).keys()].map((num) => (
                          <option key={num + 1} value={num + 1}>
                            {num + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    <p className="text-xs leading-3 text-gray-600 pt-2">
                      Price: ${item.price}
                    </p>
                    <div className="flex items-center justify-between pt-5">
                      <div className="flex items-center">
                        <button className="bg-blue-500 border rounded-md hover:bg-blue-600 px-5 py-2 text-sm text-white uppercase mr-4">
                          Add to favorites
                        </button>
                        <button
                          className="bg-red-500 border rounded-md hover:bg-red-600 px-5 py-2 text-sm text-white uppercase"
                          onClick={() => {
                            handleRemoveItem(item.id);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                      <p className="text-base font-black leading-none text-gray-800">
                        ${item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}

            <a
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
            </a>
          </div>
          <div id="summary" className="w-full sm:w-1/4 md:w-1/2 px-8 py-10">
            <h1 className="font-semibold text-2xl border-b pb-8">
              Order Summary
            </h1>
            <div className="flex justify-between mt-10 mb-5">
              <span className="font-semibold text-sm uppercase">
                Items {totalItems}
              </span>
              <span className="font-semibold text-sm">${totalPrice}</span>
            </div>
            <div>
              <label className="font-medium inline-block mb-3 text-sm uppercase">
                Shipping
              </label>
              <select className="block p-2 text-gray-600 w-full text-sm">
                <option>Standard shipping - $10.00</option>
              </select>
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
                placeholder="Enter your code"
                className="p-2 text-sm w-full"
              />
            </div>
            <button className="bg-red-500 border rounded-md hover:bg-red-600 px-5 py-2 text-sm text-white uppercase">
              Apply
            </button>
            <div className="border-t mt-8">
              <div className="flex font-semibold justify-between py-6 text-sm uppercase">
                <span>Total cost</span>
                <span>${totalPrice + 10}</span> {/* Add shipping cost */}
              </div>
              <button className="bg-indigo-500 rounded-md font-semibold hover:bg-indigo-600 py-3 text-sm text-white uppercase w-full">
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
