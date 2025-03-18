"use client";

import Providers from "@/app/provider";
import React, { ReactNode } from "react";

import Footer from "@/components/Footer";
import NavbarWrapper from "@/components/Navbar/NavbarWrapper";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Providers>
      <NavbarWrapper />

      {children}
      <Footer />
    </Providers>
  );
};

export default MainLayout;
