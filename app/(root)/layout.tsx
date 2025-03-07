"use client";

import Providers from "@/app/provider";
import React from "react";

import Footer from "@/components/Footer";
import NavbarWrapper from "@/components/Navbar/NavbarWrapper";

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
