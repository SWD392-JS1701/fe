"use client";

import Link from "next/link";
import React, { FC, useEffect, useState, KeyboardEvent } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { useSession, signOut } from "next-auth/react";
import dynamic from "next/dynamic";
import { searchProductsByName } from "@/app/services/productService";
import { Product } from "@/app/types/product";
import debounce from "lodash/debounce";

// Dynamically import Lottie with no SSR
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const Navbar: FC = () => {
  const [scrollCount, setScrollCount] = useState(0);
  const maxScrollCount = 3;
  const maxBorderWidth = 250;
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [logoAnimation, setLogoAnimation] = useState<any>(null);
  const cartCount = useSelector((state: RootState) => state.cart.items.length);
  const router = useRouter();
  const { data: session } = useSession();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Debounced search function
  const debouncedSearch = debounce(async (term: string) => {
    if (term.trim().length === 0) {
      setSearchResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const results = await searchProductsByName(term);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching products:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Fetch animation JSON từ thư mục public
      fetch("/Logo.json")
        .then((response) => response.json())
        .then((data) => setLogoAnimation(data))
        .catch((error) => console.error("Error loading animation:", error));
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

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
    await signOut({ redirect: false });
    router.push("/");
  };

  const handleSearchItemClick = (productId: string) => {
    setIsOpen(false);
    setSearchTerm("");
    setSearchResults([]);
    router.push(`/products/${productId}`);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      setIsOpen(false);
      router.push(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full transition-all duration-500 ease-in-out z-50 ${
        scrollCount === maxScrollCount
          ? "bg-black text-white py-1"
          : "bg-white text-black py-3"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Search Bar */}
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search products, brands (Press Enter to search)"
                className={`w-full pl-12 pr-10 py-3 border rounded-full focus:outline-none focus:ring-2 ${
                  scrollCount === maxScrollCount
                    ? "bg-white text-black focus:ring-gray-600"
                    : "bg-gray-100 text-gray-600 focus:ring-gray-400"
                }`}
              />
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSearchTerm("");
                  setSearchResults([]);
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black"
              >
                <X className="cursor-pointer" size={20} />
              </button>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {isOpen && (searchResults.length > 0 || isLoading) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute w-full mt-2 bg-white rounded-lg shadow-lg overflow-hidden z-50"
                  >
                    {isLoading ? (
                      <div className="p-4 text-center text-gray-500">
                        Searching...
                      </div>
                    ) : (
                      <div className="max-h-96 overflow-y-auto">
                        {searchResults.map((product) => (
                          <div
                            key={product._id}
                            onClick={() => handleSearchItemClick(product._id)}
                            className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                          >
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">
                                {product.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                ${product.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Logo */}
        <div className="flex-1 flex justify-center">
          <Link href="/">
            <div
              className="cursor-pointer w-[200px] h-[50px] transition-all duration-500"
              style={{
                filter: `invert(${scrollCount / maxScrollCount})`, // Tăng dần mức độ đảo màu
                transition: "filter 0.5s ease-in-out", // Làm mượt hiệu ứng
              }}
            >
              {typeof window !== "undefined" && logoAnimation && (
                <Lottie animationData={logoAnimation} loop autoplay />
              )}
            </div>
          </Link>
        </div>

        {/* Icons */}
        <div className="flex-1 flex justify-end items-center space-x-3">
        <div className="relative group">
            <Link href={session ? "/profile" : "/sign-in"}>
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
            <div className="absolute w-full h-5 bg-transparent"></div>

            {/* Dropdown Menu */}
            <div className="absolute right-0 hidden group-hover:block w-48 bg-white rounded-md shadow-lg z-50">
              {session ? (
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
                      href="/skin-type-quiz"
                      className="block py-2 text-md text-gray-800 hover:bg-gray-200 px-4"
                    >
                      Retake the Quiz
                    </Link>
                  </div>
                  <button

                    onClick={handleLogout}

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

          <Link href="/cart" className="relative">
            <svg
              className={`w-6 h-6 transition-all duration-500 ${
                scrollCount === maxScrollCount ? "text-white" : "text-gray-800"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-0 left-4 bg-red-500 text-white text-xs rounded-full px-2">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Shortcuts */}
      <div className="flex justify-center items-center py-2 space-x-20 relative">
        <Link href="/shop">SHOP</Link>
        <Link href="/brands">BRANDS</Link>
        <Link href="/view-blog">VIEW BLOG</Link>
        <Link href="/library">SKIN TYPE LIBRARY</Link>
        <Link href="/skin-type-quiz">TAKE THE QUIZ</Link>
        <div
          className="absolute bottom-0 h-[2px] bg-white transition-all duration-500 ease-in-out"
          style={{
            width: `${(scrollCount / maxScrollCount) * maxBorderWidth}px`,
            opacity: scrollCount > 0 ? 1 : 0,
          }}
        ></div>
      </div>
    </div>
  );
};

export default Navbar;
