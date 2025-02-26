"use client";

import React, { FC, useEffect, useState } from "react";

import UserProfile from "@/components/UserProfile";
import Error from "@/components/Error";
import Loading from "@/components/Loading";

import { getUserById } from "@/app/services/userService";
import { useRouter } from "next/navigation";

const ProfilePage: FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const access_token = localStorage.getItem("access_token");

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
          address:userData.address || "",
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

    getUserProfile();
  }, []);

  if (loading) return <Loading />;
  if (!user) {
    Error("Error", "No user data available.");
    return null;
  }

  return <UserProfile user={user} />;
};

export default ProfilePage;
