"use client";

import React, { FC, useEffect, useState } from "react";
import UserProfile from "../../../components/UserProfile";
import { fetchProfile } from "../../services/authService"; // Import your API call function

const ProfilePage: FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const userData = await fetchProfile();

        
        const defaultUser = {
          firstName: userData.first_name || "",
          lastName: userData.last_name || "",
          email: userData.email || "",
          skinType: userData.skinType || "Unknown",
          sensitivity: userData.sensitivity || "Unknown",
          emailSubscription: userData.emailSubscription || "Not Subscribed",
          totalSpent: userData.totalSpent ?? 0, 
          orderCount: userData.orderCount ?? 0,
          addressCount: userData.addressCount ?? 0,
        };

        setUser(defaultUser);
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    getUserProfile();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!user) return <p>No user data available.</p>;

  return <UserProfile user={user} />;
};

export default ProfilePage;
