"use client";

import Footer from "@/components/Footer";
import NavbarWrapper from "@/components/Navbar/NavbarWrapper";

import { getUserRole  } from "@/app/services/authService";

import DoctorNavbar from "@/components/Navbar/DoctorNavbar";
import { Route } from "lucide-react";
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  
  return (
    <>
      <NavbarWrapper />
      {children}
      <Footer />
    </>
  );
};

export default MainLayout;
