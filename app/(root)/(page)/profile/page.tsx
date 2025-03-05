"use client";

import React, { FC, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import UserProfile from "@/components/UserProfile";
import Error from "@/components/Error";
import Loading from "@/components/Loading";

import { getUserById } from "@/app/services/userService";
import { useRouter } from "next/navigation";
import { useAuthRedirect } from "@/app/services/userService";

const ProfilePage: FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // This will handle the redirection if not authenticated
  useAuthRedirect();

  useEffect(() => {
    console.log("Session Status:", status);
    console.log("Session Data:", session);

    if (status === "loading") return;

    if (!session) {
      router.push("/sign-in");
      return;
    }
    
    const getUserProfile = async () => {
      try {
        console.log("Calling getUserById with session:", {
          id: session?.user?.id,
          email: session?.user?.email,
          role: session?.user?.role
        });
        
        const userData = await getUserById(session);
        
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
        console.error("Error in getUserProfile:", err);
        Error(
          "Profile Load Failed",
          "We couldn't load your profile. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    getUserProfile();
  }, [session, status, router]);

  if (loading) return <Loading />;
  if (!user) {
    Error("Error", "No user data available.");
    return null;
  }

  return <UserProfile user={user} setUser={setUser} />;
};

export default ProfilePage;
