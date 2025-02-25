"use client";

import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import { Search, X } from "lucide-react";
import Logo from "../assets/logo.png";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const Navbar: FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrollCount, setScrollCount] = useState(0);
  const maxScrollCount = 3; //
  const maxBorderWidth = 250; // the max width of border when the scroll count is 3
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("access_token");
      setIsLoggedIn(!!token);
    };

    // Initial check
    checkLoginStatus();

    // Listen for login/logout events
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollDiff = scrollY - lastScrollY;

      if (scrollDiff > 0 && scrollCount < maxScrollCount) {
        // If scroll down, increase the scroll count but not over 3
        setScrollCount((prev) => Math.min(prev + 1, maxScrollCount));
      } else if (scrollDiff < 0 && scrollCount > 0) {
        // If scroll up, decrease the scroll count but not lower than 0
        setScrollCount((prev) => Math.max(prev - 1, 0));
      }

      lastScrollY = scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollCount]);

  return (
    <div
      className={`fixed top-0 left-0 w-full transition-all duration-500 ease-in-out z-50 ${
        scrollCount === maxScrollCount
          ? "bg-black text-white py-1"
          : "bg-white text-black py-3"
      }`}
    >
      {/* Top navbar */}
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Search bar */}
        <div className="relative w-full max-w-lg">
          {!isOpen ? (
            <button
              onClick={() => setIsOpen(true)}
              className="p-2 rounded-full bg-white hover:bg-gray-300"
            >
              <Search size={24} className="text-gray-600 cursor-pointer" />
            </button>
          ) : (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="relative w-full"
            >
              <input
                type="text"
                autoFocus
                placeholder="Search products, brands"
                className={`w-full pl-12 pr-10 py-3 border rounded-full focus:outline-none focus:ring-2 ${
                  scrollCount === maxScrollCount
                    ? "bg-white text-black focus:ring-gray-600"
                    : "bg-gray-100 text-gray-600 focus:ring-gray-400"
                }`}
              />
              <Search
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                  scrollCount === maxScrollCount
                    ? "text-black"
                    : "text-gray-400"
                }`}
                size={20}
              />
              <button
                onClick={() => setIsOpen(false)}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${
                  scrollCount === maxScrollCount
                    ? "text-black hover:text-gray-800"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                <X className="cursor-pointer" size={20} />
              </button>
            </motion.div>
          )}
        </div>

        {/* Logo */}
        <div className="flex-1 flex justify-center">
          <Link href="/">
            <div className="cursor-pointer">
              <Image
                src={Logo}
                alt="SkinType Solutions"
                width={200}
                height={50}
                priority
                className={`transition-all duration-500 ${
                  scrollCount === maxScrollCount ? "invert" : ""
                }`}
              />
            </div>
          </Link>
        </div>

        {/* Icons */}
        <div className="flex-1 flex justify-end items-center space-x-3">
          <div className="relative group">
            <Link href={isLoggedIn ? "/profile" : "/sign-in"}>
              <svg
                className={`w-6 h-6 transition-all duration-500 ${
                  scrollCount === maxScrollCount
                    ? "text-white"
                    : "text-gray-800"
                }`}
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

            {/* Transparent overlay for hover */}
            <div className="absolute w-full h-5 bg-transparent"></div>

            {/* Dropdown Menu */}
            <div className="absolute right-0 hidden group-hover:block w-48 bg-white rounded-md shadow-lg z-50">
              {isLoggedIn ? (
                <>
                  <div className="px-4 py-3 border-b border-gray-200">
                    <Link
                      href="/rewards"
                      className="block py-2 text-md text-gray-800 hover:bg-gray-200 px-4"
                    >
                      My Rewards
                    </Link>
                    <Link
                      href="/routine"
                      className="block py-2 text-md text-gray-800 hover:bg-gray-200 px-4"
                    >
                      My Routine Steps
                    </Link>
                    <Link
                      href="/shop-routine"
                      className="block py-2 text-md text-gray-800 hover:bg-gray-200 px-4"
                    >
                      Shop My Routine
                    </Link>
                    <Link
                      href="/quiz"
                      className="block py-2 text-md text-gray-800 hover:bg-gray-200 px-4"
                    >
                      Retake the Quiz
                    </Link>
                  </div>
                  <button
                    onClick={() => {
                      localStorage.removeItem("access_token");
                      setIsLoggedIn(false);
                      window.dispatchEvent(new Event("storage"));
                      router.push("/");
                    }}
                    className="block w-full text-center py-3 text-sm bg-black text-white hover:bg-gray-900"
                  >
                    LOGOUT
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="block w-full text-center py-3 text-sm bg-black text-white hover:bg-gray-900"
                  >
                    LOGIN
                  </Link>
                  <Link
                    href="/sign-up"
                    className="block w-full text-center py-3 text-sm border text-black border-gray-200 hover:bg-gray-50"
                  >
                    SIGN UP
                  </Link>
                </>
              )}
            </div>
          </div>

          <Link href="/cart">
            <svg
              className={`w-6 h-6 transition-all duration-500 ${
                scrollCount === maxScrollCount ? "text-white" : "text-gray-800"
              }`}
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

      {/* Shortcuts */}
      <div className="flex justify-center items-center py-2 space-x-20 relative">
        <Link href="/shop">SHOP</Link>
        <Link href="/brands">BRANDS</Link>
        <Link href="/blog">BLOG</Link>
        <Link href="/library">SKIN TYPE LIBRARY</Link>
        <Link href="/quiz">TAKE THE QUIZ</Link>

        {/* Border Animation */}
        <div
          className="absolute bottom-0 h-[2px] bg-white transition-all duration-500 ease-in-out"
          style={{
            width: `${(scrollCount / maxScrollCount) * maxBorderWidth}px`,
            opacity: scrollCount > 0 ? 1 : 0, // hide when does not scroll
          }}
        ></div>
      </div>
    </div>
  );
};

export default Navbar;
