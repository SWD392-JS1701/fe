import React from "react";
import Link from "next/link";

const AdminNavbar = () => {
  return (
    <nav className="bg-white shadow-md p-4 w-full">
      <div className="max-w-[1400px] mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold text-gray-800">GlowUp</div>

        {/* Navigation Links */}
        <div className="flex space-x-6">
          <Link href="/overview" className="text-gray-700 hover:text-blue-600">
            Overview
          </Link>
          <Link href="/product" className="text-gray-700 hover:text-blue-600">
            Product
          </Link>
          <Link
            href="/transaction"
            className="text-gray-700 hover:text-blue-600"
          >
            Transaction
          </Link>
          <Link href="/employee" className="text-gray-700 hover:text-blue-600">
            Employee
          </Link>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src="https://res.cloudinary.com/djv4xa6wu/image/upload/v1735722165/AbhirajK/Abhirajk.webp"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-gray-700">Vincentius R</span>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
