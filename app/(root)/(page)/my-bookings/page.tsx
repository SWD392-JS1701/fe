"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { format, isPast } from "date-fns";
import { toast } from "react-hot-toast";
import { Booking } from "@/app/types/booking";
import { Doctor } from "@/app/types/doctor";
import {
  getAllBookingsController,
  deleteBookingController,
} from "@/app/controller/bookingController";
import { getDoctorById } from "@/app/services/doctorService";
import { updateExistingSlot } from "@/app/controller/scheduleController";
import { useDispatch } from "react-redux";
import {
  setBookingCount,
  decrementBookingCount,
} from "@/lib/redux/bookingSlice";
import Image from "next/image";

interface BookingWithDoctor extends Booking {
  doctor?: Doctor | null;
  type?: string;
  description?: string;
}

const MyBookingsPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();
  const [bookings, setBookings] = useState<BookingWithDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");

  useEffect(() => {
    if (!session?.user?.id) {
      router.push("/sign-in");
      return;
    }

    const fetchBookings = async () => {
      try {
        const allBookings = await getAllBookingsController();
        // Filter bookings for the current user
        const userBookings = allBookings.filter(
          (booking) => booking.user_id === session.user.id
        );

        // Fetch doctor details for each booking
        const bookingsWithDoctors = await Promise.all(
          userBookings.map(async (booking) => {
            try {
              const doctor = await getDoctorById(booking.doctor_id);
              return { ...booking, doctor } as BookingWithDoctor;
            } catch (error) {
              console.error(
                `Error fetching doctor for booking ${booking._id}:`,
                error
              );
              return { ...booking, doctor: null } as BookingWithDoctor;
            }
          })
        );

        setBookings(bookingsWithDoctors);

        // Set the booking count in Redux (only count active bookings)
        const activeBookings = bookingsWithDoctors.filter(
          (booking) => !isPast(new Date(booking.booking_time))
        );
        dispatch(setBookingCount(activeBookings.length));
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [session, router, dispatch]);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      // Get the booking details before deleting
      const bookingToCancel = bookings.find((b) => b._id === bookingId);
      if (!bookingToCancel) {
        throw new Error("Booking not found");
      }

      // Delete the booking
      await deleteBookingController(bookingId);

      // Update the slot status back to available
      if (bookingToCancel.scheduleId && bookingToCancel.slotId) {
        await updateExistingSlot(
          bookingToCancel.scheduleId,
          bookingToCancel.slotId,
          {
            status: "available",
          }
        );
      }

      // Decrement the booking count in Redux
      dispatch(decrementBookingCount());

      setBookings((prev) =>
        prev.filter((booking) => booking._id !== bookingId)
      );
      toast.success("Booking cancelled successfully");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
    }
  };

  const activeBookings = bookings.filter(
    (booking) => !isPast(new Date(booking.booking_time))
  );
  const pastBookings = bookings.filter((booking) =>
    isPast(new Date(booking.booking_time))
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab("active")}
          className={`px-4 py-2 ${
            activeTab === "active"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Active Bookings ({activeBookings.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 ${
            activeTab === "history"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Booking History ({pastBookings.length})
        </button>
      </div>

      {activeTab === "active" ? (
        activeBookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              You do not have any active bookings.
            </p>
            <button
              onClick={() => router.push("/booking")}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Book an Appointment
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <Image
                    src={
                      "https://th.bing.com/th/id/R.c01bfe8e1f11dfe3a1af580cfa3bbc89?rik=4XJslhCYu9u8CA&riu=http%3a%2f%2fhakomed.net%2fwp-content%2fuploads%2f2018%2f11%2f03.jpg&ehk=hVGis2mazsfZKbGSNt2KebgoX7%2b9lh%2bIUJTdYnIiXic%3d&risl=&pid=ImgRaw&r=0"
                    }
                    alt={booking.doctor?.name || "Doctor"}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <div className="ml-4">
                    <h3 className="font-semibold text-lg">
                      {booking.doctor?.name || "Unknown Doctor"}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {booking.doctor?.specialties?.join(", ") || "Specialist"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-gray-700">
                    <span className="font-medium">Date:</span>{" "}
                    {format(new Date(booking.booking_time), "MMMM d, yyyy")}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Time:</span>{" "}
                    {format(new Date(booking.booking_time), "h:mm a")}
                  </p>
                  {booking.doctor?.contactNumber && (
                    <p className="text-gray-700">
                      <span className="font-medium">Contact:</span>{" "}
                      {booking.doctor.contactNumber}
                    </p>
                  )}
                  <p className="text-gray-700">
                    <span className="font-medium">Type:</span>{" "}
                    {booking.type || "Not specified"}
                  </p>
                  {booking.description && (
                    <p className="text-gray-700">
                      <span className="font-medium">Message:</span>{" "}
                      {booking.description}
                    </p>
                  )}
                </div>

                <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleCancelBooking(booking._id!)}
                    className="flex items-center px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors duration-200 font-medium"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Cancel Booking
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : pastBookings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No booking history found.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pastBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow opacity-75"
            >
              <div className="flex items-center mb-4">
                <Image
                  src={
                    "https://th.bing.com/th/id/R.c01bfe8e1f11dfe3a1af580cfa3bbc89?rik=4XJslhCYu9u8CA&riu=http%3a%2f%2fhakomed.net%2fwp-content%2fuploads%2f2018%2f11%2f03.jpg&ehk=hVGis2mazsfZKbGSNt2KebgoX7%2b9lh%2bIUJTdYnIiXic%3d&risl=&pid=ImgRaw&r=0"
                  }
                  alt={booking.doctor?.name || "Doctor"}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div className="ml-4">
                  <h3 className="font-semibold text-lg">
                    {booking.doctor?.name || "Unknown Doctor"}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {booking.doctor?.specialties?.join(", ") || "Specialist"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium">Date:</span>{" "}
                  {format(new Date(booking.booking_time), "MMMM d, yyyy")}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Time:</span>{" "}
                  {format(new Date(booking.booking_time), "h:mm a")}
                </p>
                {booking.doctor?.contactNumber && (
                  <p className="text-gray-700">
                    <span className="font-medium">Contact:</span>{" "}
                    {booking.doctor.contactNumber}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
