import Link from "next/link";
import React, { FC } from "react";
import Image from "next/image";
import { FaShoppingBag } from "react-icons/fa";

const Navbar: FC = () => {
  return (
    <>
      {/* Navigation */}
      <header className="container mx-auto py-4 px-6 bg-pink-50">
        <div className="flex justify-between items-center">
          <Link href="/">
            <div className="cursor-pointer">
              <Image
                src="/logo.png"
                alt="SkinType Solutions"
                width={200}
                height={50}
                priority
              />
            </div>
          </Link>

          <div className="relative w-1/3">
            <input
              type="text"
              placeholder="Search"
              className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative">
              <span className="absolute -top-1 -right-1 bg-yellow-400 rounded-full w-3 h-3"></span>
              <Link href="/sign-in">
                <svg
                  className="w-6 h-6 text-gray-800 cursor-pointer"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Link>
            </div>
            <Link href="/search">
              <svg
                className="w-6 h-6 text-gray-800 cursor-pointer"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </Link>
            <Link href="/cart">
              <svg
                className="w-6 h-6 text-gray-800 cursor-pointer"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Navigation */}
      <nav className="bg-gray-200 py-2">
        <div className="container mx-auto flex justify-center space-x-12">
          {[
            { href: "/shop", label: "SHOP", icon: <FaShoppingBag /> },
            { href: "/brands", label: "BRANDS" },
            { href: "/library", label: "SKIN CARE LIBRARY" },
            { href: "/page/profile", label: "VIEW MY SKIN TYPE RESULTS" },
          ].map((item, index) => (
            <div
              key={index}
              className="group relative px-3 py-1.5 rounded transition-all duration-300 hover:bg-black"
            >
              <Link
                href={item.href}
                className="flex items-center text-gray-800 group-hover:text-white transition-colors duration-300"
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
                {index !== 3 && <span className="ml-1">▼</span>}
              </Link>
            </div>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
