
"use client";


import Providers from "@/app/provider";
import React from "react";


import Footer from "@/components/Footer";
import NavbarWrapper from "@/components/Navbar/NavbarWrapper";

import { getUserRole  } from "@/app/services/authService";

import DoctorNavbar from "@/components/Navbar/DoctorNavbar";
import { Route } from "lucide-react";
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  
  return (

    <Providers>
      <NavbarWrapper />

      {children}
      <Footer />
    </Providers>
  );
};

export default MainLayout;
