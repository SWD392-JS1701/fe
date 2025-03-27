"use client";

import Providers from "@/app/provider";
import React, { ReactNode } from "react";

import Footer from "@/components/Footer";
import NavbarWrapper from "@/components/Navbar/NavbarWrapper";
import ChatBot from "@/components/ChatBot/ChatBot";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Providers>
      <NavbarWrapper />

      {children}
      <Footer />
      <ChatBot />
    </Providers>
  );
};

export default MainLayout;
