"use client";

import React, { FC, useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  FaLock,
  FaEye,
  FaHistory,
  FaFileAlt,
  FaSignOutAlt,
  FaUser,
  FaShoppingCart,
} from "react-icons/fa";

import { getUserById } from "@/app/services/userService";
import { getMemberships } from "@/app/services/membershipSevice";
import UserProfile from "@/components/UserProfile";
import Membership from "@/components/Membership";
import Error from "@/components/Error";
import Loading from "@/components/Loading";

import ChangePasswordPage from "../change-password/page";


import { getUserById,useAuthRedirect  } from "@/app/services/userService";
import { useRouter } from "next/navigation";


const ProfilePage: FC = () => {
  const [user, setUser] = useState<any>(null);
  const [memberships, setMemberships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("profile");
  const router = useRouter();
  const access_token = localStorage.getItem("access_token");
  useAuthRedirect();
  useEffect(() => {
    if (!access_token) {
      Error("Not Logged In", "Please log in to view your profile.");
      router.push("/sign-in");
      return;
    }
    
    const getUserProfile = async () => {
      try {
        const userData = await getUserById();

        if (!userData) {
          throw Error("No user data available.", "No user data available.");
        }

        const defaultUser = {
          id: userData._id,
          first_name: userData.first_name || "",
          last_name: userData.last_name || "",
          email: userData.email || "",
          address: userData.address || "",
          phone_number: userData.phone_number || "",
          skinType: "Unknown",
          sensitivity: "Unknown",
          emailSubscription: "Not Subscribed",
          totalSpent: 0,
          orderCount: 0,
        };

        setUser(defaultUser);
      } catch (err) {
        Error(
          "Profile Load Failed",
          "We couldn't load your profile. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    const fetchMemberships = async () => {
      try {
        const membershipData = await getMemberships();
        setMemberships(membershipData);
      } catch (err) {
        Error(
          "Memberships Load Failed",
          "We couldn't load memberships. Please try again later."
        );
      }
    };

    getUserProfile();
    fetchMemberships();
  }, []);

  const handleNavClick = (section: string) => {
    setActiveSection(section);
  };

  if (loading) return <Loading />;
  if (!user) {
    Error("Error", "No user data available.");
    return null;
  }

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <UserProfile user={user} setUser={setUser} />;
      case "subscriptions":
        return (
          <Membership memberships={memberships} user={user} setUser={setUser} />
        );
      case "orders":
        return (
          <div className="p-6 bg-white rounded-lg border">
            <h2 className="text-2xl font-bold">Orders</h2>
            <p>Orders content coming soon...</p>
          </div>
        );
      case "change-password":
        return <ChangePasswordPage />;
      case "recently-viewed":
        return (
          <div className="p-6 bg-white rounded-lg border">
            <h2 className="text-2xl font-bold">Recently Viewed</h2>
            <p>Recently viewed content coming soon...</p>
          </div>
        );
      case "reorder":
        return (
          <div className="p-6 bg-white rounded-lg border">
            <h2 className="text-2xl font-bold">Reorder Products</h2>
            <p>Reorder content coming soon...</p>
          </div>
        );
      default:
        return <UserProfile user={user} setUser={setUser} />;
    }
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
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold mb-1 text-black">
                    {user.first_name}
                    {user.last_name ? ` ${user.last_name}` : ""}
                  </h2>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                </div>

                <nav>
                  <button
                    onClick={() => handleNavClick("profile")}
                    className={`flex items-center p-4 w-full text-left ${
                      activeSection === "profile"
                        ? "bg-black text-white"
                        : "hover:bg-gray-50 text-black"
                    }`}
                  >
                    <FaUser className="mr-3" />
                    <span>My profile</span>
                  </button>
                  <button
                    onClick={() => handleNavClick("orders")}
                    className={`flex items-center p-4 w-full text-left border-b border-gray-200 ${
                      activeSection === "orders"
                        ? "bg-black text-white"
                        : "hover:bg-gray-50 text-black"
                    }`}
                  >
                    <FaShoppingCart className="mr-3 text-gray-500" />
                    <span>Orders</span>
                  </button>
                  <button
                    onClick={() => handleNavClick("change-password")}
                    className={`flex items-center p-4 w-full text-left border-b border-gray-200 ${
                      activeSection === "change-password"
                        ? "bg-black text-white"
                        : "hover:bg-gray-50 text-black"
                    }`}
                  >
                    <FaLock className="mr-3 text-gray-500" />
                    <span>Change password</span>
                  </button>
                  <button
                    onClick={() => handleNavClick("recently-viewed")}
                    className={`flex items-center p-4 w-full text-left border-b border-gray-200 ${
                      activeSection === "recently-viewed"
                        ? "bg-black text-white"
                        : "hover:bg-gray-50 text-black"
                    }`}
                  >
                    <FaEye className="mr-3 text-gray-500" />
                    <span>Recently viewed</span>
                  </button>
                  <button
                    onClick={() => handleNavClick("reorder")}
                    className={`flex items-center p-4 w-full text-left border-b border-gray-200 ${
                      activeSection === "reorder"
                        ? "bg-black text-white"
                        : "hover:bg-gray-50 text-black"
                    }`}
                  >
                    <FaHistory className="mr-3 text-gray-500" />
                    <span>Reorder products</span>
                  </button>
                  <button
                    onClick={() => handleNavClick("subscriptions")}
                    className={`flex items-center p-4 w-full text-left border-b border-gray-200 ${
                      activeSection === "subscriptions"
                        ? "bg-black text-white"
                        : "hover:bg-gray-50 text-black"
                    }`}
                  >
                    <FaFileAlt className="mr-3 text-gray-500" />
                    <span>Subscriptions</span>
                  </button>
                  <Link
                    href="/logout"
                    className="flex items-center p-4 hover:bg-gray-50 text-black"
                  >
                    <FaSignOutAlt className="mr-3 text-gray-500" />
                    <span>Logout</span>
                  </Link>
                </nav>
              </div>
            </div>

            {/* Right Content - Conditional Rendering */}
            <div className="md:col-span-3">{renderContent()}</div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ProfilePage;
