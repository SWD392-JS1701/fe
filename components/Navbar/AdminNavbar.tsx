"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CiLogout } from "react-icons/ci";

import { getUserById, User, useAuthRedirect } from "@/app/services/userService";

const AdminNavbar = () => {
  const { isChecking } = useAuthRedirect();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserById();
        if (userData) {
          setUser(userData);
        } else {
          setError("Failed to fetch user data.");
        }
      } catch (err) {
        setError("Error fetching user data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (!isChecking) {
      fetchUser();
    }
  }, [isChecking]);

  if (isChecking || loading) {
    return (
      <nav className="bg-white shadow-md p-4 w-full border rounded-xl">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="text-xl font-bold text-gray-800">GlowUp</div>
          <div className="flex space-x-6">
            <span className="text-gray-400">Loading...</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
            <span className="text-gray-400">Loading...</span>
          </div>
        </div>
      </nav>
    );
  }

  if (error) {
    return (
      <nav className="bg-white shadow-md p-4 w-full border rounded-xl">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="text-xl font-bold text-gray-800">GlowUp</div>
          <div className="flex space-x-6">
            <span className="text-red-500">{error}</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
            <span className="text-red-500">Error</span>
          </div>
        </div>
      </nav>
    );
  }

  const handleLogout = async () => {
    localStorage.removeItem("access_token");
    window.location.href = "/sign-in";
  };

  return (
    <nav className="bg-white shadow-md p-4 w-full border rounded-xl">
      <div className="max-w-[1400px] mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold text-gray-800">GlowUp</div>

        {/* Navigation Links */}
        <div className="flex space-x-6">
          <Link
            href="/admin/overview"
            className="text-gray-700 hover:text-blue-600"
          >
            Overview
          </Link>
          <Link
            href="/admin/product"
            className="text-gray-700 hover:text-blue-600"
          >
            Product
          </Link>
          <Link
            href="/admin/schedule"
            className="text-gray-700 hover:text-blue-600"
          >
            Schedule
          </Link>
          <Link
            href="/admin/employee"
            className="text-gray-700 hover:text-blue-600"
          >
            Employee
          </Link>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src={
                "https://res.cloudinary.com/djv4xa6wu/image/upload/v1735722165/AbhirajK/Abhirajk.webp"
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-gray-700">
            {user ? `${user.first_name} ${user.last_name}` : "Admin"}
          </span>
          <CiLogout
            className="text-2xl text-gray-700 hover:text-blue-600 cursor-pointer"
            onClick={handleLogout}
          />
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
