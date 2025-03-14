"use client";

import { useSession } from "next-auth/react";
import AdminNavbar from "./AdminNavbar";
import DoctorNavbar from "./DoctorNavbar";
import Navbar from "./Navbar";
import Loading from "../Loading";
import StaffNavbar from "./StaffNavbar";

const NavbarWrapper = () => {
  const { data: session, status } = useSession();

  // Show loading state while checking authentication
  if (status === "loading") {
    return <Loading />;
  }

  // If no session exists, show the default navbar
  if (!session) {
    return <Navbar />;
  }

  // Get the role from the decoded token
  const userRole = session.user?.role;

  // Render the appropriate navbar based on role
  switch (userRole) {
    case "Admin":
      return <AdminNavbar />;
    case "Doctor":
      return <DoctorNavbar />;
    case "Staff":
      return <StaffNavbar />;
    default:
      return <Navbar />;
  }
};

export default NavbarWrapper;
