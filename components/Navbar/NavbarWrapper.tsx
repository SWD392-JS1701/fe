"use client";

import { useSession } from "next-auth/react";
import AdminNavbar from "./AdminNavbar";
import DoctorNavbar from "./DoctorNavbar";
import Navbar from "./Navbar";
import Loading from "../Loading";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";

const NavbarWrapper = () => {
  const { data: session, status } = useSession();
  const [logoAnimation, setLogoAnimation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch("/Logo.json");
        const data = await response.json();
        setLogoAnimation(data);
      } catch (error) {
        console.error("Error loading logo animation:", error);
      }
    };

    fetchLogo();
  }, []);

  useEffect(() => {
    if (status !== "loading") {
      setIsLoading(false);
    }
  }, [status]);

  if (isLoading || !logoAnimation) {
    return <Loading />;
  }

  const userRole = session?.user?.role;

  const RenderNavbar = () => {
    if (userRole === "admin") return <AdminNavbar />;
    if (userRole === "Doctor") return <DoctorNavbar />;
    return <Navbar />;
  };

  return (
    <div className="relative">
      {/* Logo Animation */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[200px] h-[50px]">
        <Lottie animationData={logoAnimation} loop autoplay />
      </div>

      {/* Navbar */}
      <RenderNavbar />
    </div>
  );
};

export default NavbarWrapper;
