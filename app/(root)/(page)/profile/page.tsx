"use client";

import React, { FC, useEffect, useState } from "react";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { signOut } from "next-auth/react";
import {
  FaLock,
  FaEye,
  FaHistory,
  FaFileAlt,
  FaSignOutAlt,
  FaUser,
  FaShoppingCart,
} from "react-icons/fa";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useSession } from "next-auth/react";

import UserProfile from "@/components/UserProfile";
import Membership from "@/components/Membership";
import Error from "@/components/Error";
import Loading from "@/components/Loading";
import ChangePasswordPage from "../change-password/page";

import { getUserById } from "@/app/services/userService";
import { getMemberships } from "@/app/services/membershipSevice";
import { useAuthRedirect } from "@/app/services/userService";

const ProfilePage: FC = () => {
  const [user, setUser] = useState<any>(null);
  const [memberships, setMemberships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("profile");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  const { data: session, status } = useSession();

  // This will handle the redirection if not authenticated
  useAuthRedirect();

  useEffect(() => {
    console.log("Session Status:", status);
    console.log("Session Data:", session);

    if (status === "loading") return;

    if (!session?.user?.access_token) {
      router.push("/sign-in");
      return;
    }

    const getUserProfile = async () => {
      try {
        console.log("Calling getUserById with session:", {
          id: session?.user?.id,
          email: session?.user?.email,
          role: session?.user?.role,
          token: session?.user?.access_token ? "present" : "missing",
        });

        const userData = await getUserById(session);

        if (!userData) {
          console.error("No user data returned from getUserById");
          setIsAuthorized(false);
          return;
        }

        setIsAuthorized(true);

        const defaultUser = {
          id: userData._id,
          first_name: userData.first_name || "",
          last_name: userData.last_name || "",
          email: userData.email || "",
          address: userData.address || "",
          phone_number: userData.phone_number || "",
          skinType: userData.skinType || "Unknown",
          sensitivity: userData.sensitivity || "Unknown",
          emailSubscription: "Not Subscribed",
          totalSpent: 0,
          orderCount: 0,
        };

        setUser(defaultUser);
      } catch (err: any) {
        console.error("Error in getUserProfile:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });

        setIsAuthorized(false);

        if (err.response?.status === 401) {
          router.push("/sign-in");
        }
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
  }, [session, status, router]);

  const handleNavClick = (section: string) => {
    setActiveSection(section);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/sign-in" });
  };

  if (isAuthorized === null || loading) {
    return <Loading />;
  }

  if (!isAuthorized) {
    return null;
  }

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
                  <Dialog
                    open={showLogoutDialog}
                    onOpenChange={setShowLogoutDialog}
                  >
                    <DialogTrigger asChild>
                      <button className="flex items-center p-4 hover:bg-gray-50 text-black w-full text-left">
                        <FaSignOutAlt className="mr-3 text-gray-500" />
                        <span>Logout</span>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Confirm Logout</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to log out? You will need to
                          sign in again to access your profile.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="sm:justify-end">
                        <Button
                          variant="outline"
                          onClick={() => setShowLogoutDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            handleLogout();
                            setShowLogoutDialog(false);
                          }}
                        >
                          Logout
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
