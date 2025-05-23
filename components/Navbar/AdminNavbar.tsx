"use client";

import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import Logo from "@/assets/logo.png";
import { signOut } from "next-auth/react";

const DoctorNavbar: FC = () => {
  const [scrollCount, setScrollCount] = useState(0);
  const maxScrollCount = 3;
  const maxBorderWidth = 250;

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollDiff = scrollY - lastScrollY;

      if (scrollDiff > 0 && scrollCount < maxScrollCount) {
        setScrollCount((prev) => Math.min(prev + 1, maxScrollCount));
      } else if (scrollDiff < 0 && scrollCount > 0) {
        setScrollCount((prev) => Math.max(prev - 1, 0));
      }

      lastScrollY = scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollCount]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/sign-in" });
  };

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
        <div className="relative w-full max-w-lg"></div>

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
            <Link href="/profile">
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
              <button
                onClick={handleLogout}
                className="block w-full text-center py-3 text-sm bg-black text-white hover:bg-gray-900"
              >
                LOGOUT
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Shortcuts */}
      <div className="flex justify-center items-center py-2 space-x-20 relative">
        {[
          { label: "OVERVIEW", href: "/admin/overview" },
          { label: "PRODUCT", href: "/admin/product" },
          { label: "SCHEDULE", href: "/admin/schedule" },
          { label: "PROMOTION", href: "/admin/promotion" },
          { label: "EMPLOYEE MANAGEMENT", href: "/admin/employee" },
        ].map(({ label, href }, index) => (
          <Link key={index} href={href} className="relative group">
            <span>{label}</span>
            <span
              className={`absolute left-0 bottom-0 h-[2px] transition-all duration-300 w-0 group-hover:w-full ${
                scrollCount === maxScrollCount ? "bg-white" : "bg-black"
              }`}
            ></span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DoctorNavbar;
