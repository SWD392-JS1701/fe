"use client";

import React, { useState, FC, useEffect } from "react";
import { findBookingsByDoctorIdController } from "@/app/controller/bookingController";
import { Booking } from "@/app/types/booking";
import { toast } from "react-hot-toast";
import { format, isPast } from "date-fns";
import { useSession } from "next-auth/react";
import { fetchDoctorByUserId } from "@/app/controller/doctorController";
import { Doctor } from "@/app/types/doctor";

const ViewAppointment: FC = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();
  const tabs = ["active", "history"];
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 5;

  useEffect(() => {
    const fetchAppointments = async () => {
      if (status === "loading") return;

      try {
        setIsLoading(true);
        if (!session?.user?.id) {
          throw new Error("No user session found");
        }

        const doctorInfo = await fetchDoctorByUserId(session.user.id);
        console.log("doctorinfor",doctorInfo)
        setCurrentDoctor(doctorInfo);

        if (!doctorInfo?._id) {
          throw new Error("Doctor ID not found");
        }

        const fetchedBookings = await findBookingsByDoctorIdController(doctorInfo._id);
        const bookingsArray = Array.isArray(fetchedBookings) ? fetchedBookings : [fetchedBookings];
        setBookings(bookingsArray);
      } catch (error) {
        toast.error("Failed to fetch appointments");
        console.error("Error fetching appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [session, status]); // Add status to dependencies

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return {
      dayName: date.toLocaleString("en-US", { weekday: "short" }),
      dayNumber: date.getDate(),
      month: date.toLocaleString("en-US", { month: "long" }),
    };
  };

  const filteredBookings = bookings.filter((booking) => {
    return activeTab === "active" ? !isPast(new Date(booking.booking_time)) : isPast(new Date(booking.booking_time));
  });

  // Get current bookings for pagination
  const indexOfLastBooking = currentPage * appointmentsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - appointmentsPerPage;
  const currentBookings = filteredBookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 mt-30">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Bookings</h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                activeTab === tab
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1); // Reset to first page when changing tabs
              }}
            >
              {tab} ({tab === "active" ? bookings.filter(booking => !isPast(new Date(booking.booking_time))).length : bookings.filter(booking => isPast(new Date(booking.booking_time))).length})
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading appointments...</p>
          </div>
        ) : (
          <>
            {/* Bookings List */}
            <div className="space-y-4">
              {currentBookings.map((booking) => {
                const { dayName, dayNumber } = formatDate(booking.booking_time);
                return (
                  <div
                    key={booking._id}
                    className={`bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                      activeTab === "history" ? "opacity-75" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="text-center min-w-[60px]">
                        <div className={`font-bold ${dayName === "Wed" ? "text-red-500" : "text-gray-500"}`}>
                          {dayName}
                        </div>
                        <div className={`text-2xl font-bold ${dayName === "Wed" ? "text-red-500" : "text-gray-800"}`}>
                          {dayNumber}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-gray-800">
                          <i className="fas fa-clock text-gray-500"></i>
                          <span>{format(new Date(booking.booking_time), 'HH:mm')}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-gray-800">
                          <i className="fas fa-map-marker-alt text-gray-500"></i>
                          <span>Online Consultation</span>
                        </div>
                        <div className="mt-2 text-gray-800 font-medium">
                          {booking.type || `Appointment on ${format(new Date(booking.booking_time), 'yyyy-MM-dd')}`}
                        </div>
                        {booking.description && (
                          <div className="mt-2 text-gray-600 text-sm">
                            <i className="fas fa-comment-alt text-gray-500 mr-2"></i>
                            {booking.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {filteredBookings.length > 0 ? (
              <div className="flex justify-center items-center mt-6 gap-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Previous
                </button>
                <span className="text-gray-600">
                  Page {currentPage} of{" "}
                  {Math.ceil(filteredBookings.length / appointmentsPerPage)}
                </span>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={
                    currentPage ===
                    Math.ceil(filteredBookings.length / appointmentsPerPage)
                  }
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    currentPage ===
                    Math.ceil(filteredBookings.length / appointmentsPerPage)
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Next
                </button>
              </div>
            ) : (
              <p className="text-gray-600 text-center">
                No appointments found for {activeTab}.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ViewAppointment;
