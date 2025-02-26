import AdminNavbar from "@/components/AdminNavbar";
import Footer from "@/components/Footer";
import React from "react";

const AdminLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <AdminNavbar />
      {children}
      <Footer />
    </>
  );
};

export default AdminLayout;
