"use client";

import { useSession } from "next-auth/react";
import AdminNavbar from "./AdminNavbar";
import DoctorNavbar from "./DoctorNavbar";
import Navbar from "./Navbar";
import Loading from "../Loading";
import StaffNavbar from "./StaffNavbar";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { resetBookingCount, setBookingCount } from "@/lib/redux/bookingSlice";
import { getAllBookingsController } from "@/app/controller/bookingController";
import { isPast } from "date-fns";

const NavbarWrapper = () => {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();

  // Fetch and set booking count when session changes
  useEffect(() => {
    const fetchBookingCount = async () => {
      if (session?.user?.id) {
        try {
          const allBookings = await getAllBookingsController();
          const userBookings = allBookings.filter(booking => booking.user_id === session.user.id);
          const activeBookings = userBookings.filter(booking => !isPast(new Date(booking.booking_time)));
          dispatch(setBookingCount(activeBookings.length));
        } catch (error) {
          console.error("Error fetching booking count:", error);
          dispatch(resetBookingCount());
        }
      } else {
        dispatch(resetBookingCount());
      }
    };

    fetchBookingCount();
  }, [session, dispatch]);

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
