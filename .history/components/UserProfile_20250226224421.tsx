"use client";

import React, { FC }  from "react";
import  { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { updateUser } from "@/app/services/userService";
import { useEffect } from "react";
import {
  FaLock,
  FaEye,
  FaHistory,
  FaFileAlt,
  FaSignOutAlt,
  FaUser,
  FaEdit,
  FaSave, 
  FaTimes,
  FaDollarSign,
  FaShoppingCart,
  FaMapMarked,
} from "react-icons/fa";

interface UserProfileProps {
  user: {
    id:string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
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
  const [isEditing, setIsEditing] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    address: user?.address || "",
    phone_number: user?.phone_number || "",
    skinType: user?.skinType|| "",
    sensitivity: user?.sensitivity || "",
  });
  useEffect(() => {
    setFormData({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      address: user.address || "",
      phone_number: user.phone_number || "",
      skinType: user.skinType || "",
      sensitivity: user.sensitivity || "",
    });
  }, [user]); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    
    setLoading(true);
    setError("");
    setSuccess(false);
    
    const updatedUser = await updateUser(user.id, formData);

    if (updatedUser) {
      setIsEditing(false);
      setSuccess(true);
    } else {
      setError("Failed to update profile. Please try again.");
    }
    setLoading(false);
  };

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
                    {user.first_name}
                    {user.last_name ? ` ${user.last_name}` : ""}
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


                  {isEditing ? (
                    <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">
                      <FaTimes className="text-3xl" />
                    </button>
                  ) : (
                    <button onClick={() => setIsEditing(true)} className="text-gray-500 hover:text-gray-700">
                      <FaEdit className="text-3xl" />
                    </button>
                  )}
                </div>

               {isEditing ? (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-12 items-center">
                  <label className="col-span-3 text-sm font-bold text-gray-600">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="col-span-9 border p-2 rounded-md"
                  />
                </div>

                <div className="grid grid-cols-12 items-center">
                  <label className="col-span-3 text-sm font-bold text-gray-600">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="col-span-9 border p-2 rounded-md"
                  />
                </div>

                <div className="grid grid-cols-12 items-center">
                  <label className="col-span-3 text-sm font-bold text-gray-600">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="col-span-9 border p-2 rounded-md"
                  />
                </div>

                <div className="grid grid-cols-12 items-center">
                  <label className="col-span-3 text-sm font-bold text-gray-600">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="col-span-9 border p-2 rounded-md"
                  />
                </div>

                <div className="flex justify-end gap-4 mt-4">
                  <button
                    type="submit"
                    className="bg-black text-white px-4 py-2 rounded-md flex items-center"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : <><FaSave className="mr-2" /> Save</>}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-400 text-white px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                </div>

                {error && <p className="text-red-500 mt-2">{error}</p>}
                {success && <p className="text-green-500 mt-2">Profile updated successfully!</p>}
              </form>
            ) : (
              <div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-12 items-center">
                    <h3 className="col-span-3 text-sm font-bold text-gray-600">
                      First name
                    </h3>
                    <p className="col-span-9 text-gray-800">{user.first_name}</p>
                  </div>
                </div>
                <div className="grid grid-cols-12 items-center">
                    <h3 className="col-span-3 text-sm font-bold text-gray-600 py-2.5">
                      Last name
                    </h3>
                    <p className="col-span-9 text-gray-800">
                      {user.last_name || "noLastName"}
                    </p>
                  </div>
                  <div className="grid grid-cols-12 items-center">
                    <h3 className="col-span-3 text-sm font-bold text-gray-600 py-2.5">
                      Phone number
                    </h3>
                    <p className="col-span-9 text-gray-800">{user.phone_number}</p>
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
            )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default UserProfile;
