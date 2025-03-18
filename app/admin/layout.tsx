"use client";

import { ReactNode } from "react";
import AdminNavbar from "@/components/Navbar/AdminNavbar";
import Footer from "@/components/Footer";
import React from "react";
import { useSession } from "next-auth/react";
import Loading from "@/components/Loading";

const AdminLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  const { status } = useSession();

  // Only handle loading state, middleware handles protection
  if (status === "loading") {
    return <Loading />;
  }

  return (
    <>
      <AdminNavbar />
      {children}
      <Footer />
    </>
  );
};

export default AdminLayout;
