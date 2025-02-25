"use client";

import React, { FC, useEffect, useState } from "react";

import UserProfile from "../../../components/UserProfile";
import Error from "@/components/Error";
import Loading from "@/components/Loading";

import { getUserById } from "@/app/services/userService";

const ProfilePage: FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const userData = await getUserById();
        if (!userData) {
          throw Error("No user data available.", "No user data available.");
        }

        const defaultUser = {
          firstName: userData.first_name || "",
          lastName: userData.last_name || "",
          email: userData.email || "",
          skinType: userData.skinType || "Unknown",
          sensitivity: userData.sensitivity || "Unknown",
          emailSubscription: userData.emailSubscription || "Not Subscribed",
          totalSpent: userData.totalSpent ?? 0,
          orderCount: userData.orderCount ?? 0,
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
