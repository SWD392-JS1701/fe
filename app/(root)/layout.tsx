import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Providers from "@/app/provider";
import React from "react";

const MainLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <Providers>
      <Navbar />
      {children}
      <Footer />
    </Providers>
  );
};

export default MainLayout;
