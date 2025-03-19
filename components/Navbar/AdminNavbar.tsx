"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const AdminNavbar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/sign-in" });
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
            href="/admin/promotion"
            className="text-gray-700 hover:text-blue-600"
          >
            Promotion
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
          <div className="relative group">
            <div className="flex items-center space-x-4 cursor-pointer">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src="https://res.cloudinary.com/djv4xa6wu/image/upload/v1735722165/AbhirajK/Abhirajk.webp"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-gray-700">{"Admin"}</span>
            </div>

            {/* Dropdown Menu */}
            <div className="absolute right-0 hidden group-hover:block w-48 bg-white rounded-md shadow-lg z-50">
              <div className="py-1">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
