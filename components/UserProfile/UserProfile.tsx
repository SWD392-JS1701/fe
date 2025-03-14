"use client";

import React, { FC, useState } from "react";
import { useSession } from "next-auth/react";
import { updateUser } from "@/app/services/userService";
import { toast, Toaster } from "react-hot-toast";
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaDollarSign,
  FaShoppingCart,
  FaMapMarked,
} from "react-icons/fa";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  skinType: string;
  sensitivity: string;
  emailSubscription: string;
  totalSpent: number;
  orderCount: number;
  addressCount?: number;
}

interface UserProfileProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

const UserProfile: FC<UserProfileProps> = ({ user, setUser }) => {
  const { data: session } = useSession();
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
    skinType: user?.skinType || "",
    sensitivity: user?.sensitivity || "",
  });

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
      setUser((prevUser) => ({
        ...prevUser,
        ...formData,
      }));
      toast(
        <p className="text-green-500 mt-2">Profile updated successfully!</p>
      );
      setIsEditing(false);
      setSuccess(true);
    } else {
      setError("Failed to update profile. Please try again.");
    }
    setLoading(false);
  };

  return (
    <>
      <Toaster />
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        {/* Dashboard Stats - Only shown for normal users */}
        {session?.user?.role === "User" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 border-b border-gray-200 pb-8">
            <div className="flex items-center border border-black-200 rounded-lg p-4">
              <div className="mr-4">
                <FaDollarSign className="text-2xl text-black" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-black">Total spent</h3>
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
                <h3 className="text-sm font-bold text-black">All orders</h3>
                <p className="text-lg font-bold text-black">{user.orderCount}</p>
              </div>
            </div>

            <div className="flex items-center border border-black-200 rounded-lg p-4">
              <div className="mr-4">
                <FaMapMarked className="text-2xl text-black" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-black">Addresses</h3>
                <p className="text-lg font-bold text-black">
                  {user.addressCount || 1}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Profile Information */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-black">My profile</h2>

          {isEditing ? (
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="text-3xl" />
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaEdit className="text-3xl" />
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-12 items-center">
              <label className="col-span-3 text-sm font-bold text-gray-600">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="col-span-9 border p-2 rounded-md"
              />
            </div>

            <div className="grid grid-cols-12 items-center">
              <label className="col-span-3 text-sm font-bold text-gray-600">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="col-span-9 border p-2 rounded-md"
              />
            </div>

            <div className="grid grid-cols-12 items-center">
              <label className="col-span-3 text-sm font-bold text-gray-600">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="col-span-9 border p-2 rounded-md"
              />
            </div>

            <div className="grid grid-cols-12 items-center">
              <label className="col-span-3 text-sm font-bold text-gray-600">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="col-span-9 border p-2 rounded-md"
              />
            </div>

            <div className="grid grid-cols-12 items-center">
              <label className="col-span-3 text-sm font-bold text-gray-600">
                Phone number
              </label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="col-span-9 border p-2 rounded-md"
              />
            </div>

            <div className="grid grid-cols-12 items-center">
              <label className="col-span-3 text-sm font-bold text-gray-600">
                Skin Type
              </label>
              <input
                type="text"
                name="skinType"
                value={formData.skinType}
                onChange={handleChange}
                className="col-span-9 border p-2 rounded-md"
              />
            </div>

            <div className="grid grid-cols-12 items-center">
              <label className="col-span-3 text-sm font-bold text-gray-600">
                Sensitivity
              </label>
              <input
                type="text"
                name="sensitivity"
                value={formData.sensitivity}
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
                {loading ? (
                  "Saving..."
                ) : (
                  <>
                    <FaSave className="mr-2" /> Save
                  </>
                )}
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
              <p className="col-span-9 text-gray-800">{user.sensitivity}</p>
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
    </>
  );
};

export default UserProfile;
