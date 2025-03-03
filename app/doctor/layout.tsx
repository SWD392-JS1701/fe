
import Footer from "@/components/Footer";
import React from "react";
import DoctorNavbar from "@/components/Navbar/DoctorNavbar";
const DoctorLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <DoctorNavbar />
      {children}
      <Footer />
    </>
  );
};

export default DoctorLayout;
