"use client";

import React, { FC } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  FaLock,
  FaEye,
  FaHistory,
  FaFileAlt,
  FaSignOutAlt,
  FaUser,
  FaEdit,
  FaDollarSign,
  FaShoppingCart,
  FaMapMarked,
} from "react-icons/fa";

interface UserProfileProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    address:string;
    skinType: string;
    sensitivity: string;
    emailSubscription: string;
    totalSpent: number;
    orderCount: number;
    addressCount: number;
  };
}

const UserProfile: FC<UserProfileProps> = ({ user }) => {
  return (
    <>
      <Head>
        <title>My Profile | SkinType Solutions</title>
      </Head>

      <div className="bg-pink-50">
        <main className="container mx-auto py-30 px-4 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Left Sidebar - User Info & Navigation */}
            <div className="md:col-span-1">
              <div className="border border-gray-200 rounded-md overflow-hidden">
                {/* User Name and Email */}
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold mb-1 text-black">
                    {user.firstName}
                    {user.lastName ? ` ${user.lastName}` : ""}
                  </h2>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                </div>

                {/* Profile Navigation */}
                <nav>
                  <Link
                    href="/profile"
                    className="flex items-center p-4 bg-black text-white"
                  >
                    <FaUser className="mr-3" />
                    <span>My profile</span>
                  </Link>
                  <Link
                    href="/orders"
                    className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-50"
                  >
                    <FaShoppingCart className="mr-3 text-gray-500" />
                    <span className="text-black">Orders</span>
                  </Link>
                  <Link
                    href="/change-password"
                    className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-50"
                  >
                    <FaLock className="mr-3 text-gray-500" />
                    <span className="text-black">Change password</span>
                  </Link>
                  <Link
                    href="/recently-viewed"
                    className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-50"
                  >
                    <FaEye className="mr-3 text-gray-500" />
                    <span className="text-black">Recently viewed</span>
                  </Link>
                  <Link
                    href="/reorder"
                    className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-50"
                  >
                    <FaHistory className="mr-3 text-gray-500" />
                    <span className="text-black">Reorder products</span>
                  </Link>
                  <Link
                    href="/subscription"
                    className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-50"
                  >
                    <FaFileAlt className="mr-3 text-gray-500" />
                    <span className="text-black">Subscriptions</span>
                  </Link>
                  <Link
                    href="/logout"
                    className="flex items-center p-4 hover:bg-gray-50"
                  >
                    <FaSignOutAlt className="mr-3 text-gray-500" />
                    <span className="text-black">Logout</span>
                  </Link>
                </nav>
              </div>
            </div>

            {/* Right Content - Profile Details with Stats */}
            <div className="md:col-span-3">
              <div className="border border-gray-200 rounded-lg p-6 bg-white">
                {/* Dashboard Stats - Now part of profile information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 border-b border-gray-200 pb-8">
                  <div className="flex items-center border border-black-200 rounded-lg p-4">
                    <div className="mr-4">
                      <FaDollarSign className="text-2xl text-black" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-black">
                        Total spent
                      </h3>
                      <p className="text-lg font-bold text-black">
                        ${user.totalSpent.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center border border-black-200 rounded-lg p-4">
                    <div className="mr-4">
                      <FaShoppingCart className="text-2xl text-black" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-black">
                        All orders
                      </h3>
                      <p className="text-lg font-bold text-black">
                        {user.orderCount}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center border border-black-200 rounded-lg p-4">
                    <div className="mr-4">
                      <FaMapMarked className="text-2xl text-black" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-black">
                        Addresses
                      </h3>
                      <p className="text-lg font-bold text-black">
                        {user.addressCount}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Profile Information */}

                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-black">My profile</h2>
                  <button className="text-gray-500 hover:text-gray-700">
                    <FaEdit className="text-3xl" />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-12 items-center">
                    <h3 className="col-span-3 text-sm font-bold text-gray-600">
                      First name
                    </h3>
                    <p className="col-span-9 text-gray-800">{user.firstName}</p>
                  </div>

                  <div className="grid grid-cols-12 items-center">
                    <h3 className="col-span-3 text-sm font-bold text-gray-600 py-2.5">
                      Last name
                    </h3>
                    <p className="col-span-9 text-gray-800">
                      {user.lastName || "noLastName"}
                    </p>
                  </div>

                  <div className="grid grid-cols-12 items-center">
                    <h3 className="col-span-3 text-sm font-bold text-gray-600 py-2.5">
                      Email
                    </h3>
                    <p className="col-span-9 text-gray-800">{user.email}</p>
                  </div>
                  <div className="grid grid-cols-12 items-center">
                    <h3 className="col-span-3 text-sm font-bold text-gray-600 py-2.5">
                      Address
                    </h3>
                    <p className="col-span-9 text-gray-800">{user.address}</p>
                  </div>
                  <div className="grid grid-cols-12 items-center">
                    <h3 className="col-span-3 text-sm font-bold text-gray-600 py-2.5">
                      Skin Type
                    </h3>
                    <p className="col-span-9 text-gray-800">{user.skinType}</p>
                  </div>

                  <div className="grid grid-cols-12 items-center">
                    <h3 className="col-span-3 text-sm font-bold text-gray-600 py-2.5">
                      Sensitivity
                    </h3>
                    <p className="col-span-9 text-gray-800">
                      {user.sensitivity}
                    </p>
                  </div>

                  <div className="grid grid-cols-12 items-center">
                    <h3 className="col-span-3 text-sm font-bold text-gray-600 py-2.5">
                      Email subscription
                    </h3>
                    <p className="col-span-9 text-gray-800">
                      {user.emailSubscription}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default UserProfile;
