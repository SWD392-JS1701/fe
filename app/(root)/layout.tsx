"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar/Navbar";

import { getUserRole  } from "@/app/services/authService";

import DoctorNavbar from "@/components/Navbar/DoctorNavbar";
import { Route } from "lucide-react";
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const  role  = getUserRole();
  return (
    <>
      <Navbar />
    
      {role === "User" && <Navbar />}
      {role === "Doctor" && <DoctorNavbar />}

      
      {children}
      <Footer />
    </>
  );
};

export default MainLayout;
