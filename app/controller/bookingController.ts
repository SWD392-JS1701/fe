import {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  findBookingsByUserId,
  hasActiveBooking
} from "@/app/services/bookingService";
import { toast } from "react-hot-toast";
import {
  Booking,
  CreateBookingRequest,
  UpdateBookingRequest,
} from "@/app/types/booking";


export const getAllBookingsController = async (): Promise<Booking[]> => {
  try {
    const bookings = await getAllBookings();
    return bookings.map((booking) => ({
      ...booking,
      booking_time:
        typeof booking.booking_time === "string"
          ? new Date(booking.booking_time)
          : booking.booking_time,
    }));
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const getBookingByIdController = async (
  bookingId: string
): Promise<Booking> => {
  try {
    const booking = await getBookingById(bookingId);
    return {
      ...booking,
      booking_time:
        typeof booking.booking_time === "string"
          ? new Date(booking.booking_time)
          : booking.booking_time,
    };
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const createBookingController = async (
  bookingData: CreateBookingRequest
): Promise<Booking> => {
  try {
    const processedBookingData: CreateBookingRequest = {
      ...bookingData,
      booking_time:
        bookingData.booking_time instanceof Date
          ? bookingData.booking_time
          : new Date(bookingData.booking_time),
    };
    const newBooking = await createBooking(processedBookingData);
    return {
      ...newBooking,
      booking_time:
        typeof newBooking.booking_time === "string"
          ? new Date(newBooking.booking_time)
          : newBooking.booking_time,
    };
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const updateBookingController = async (
  bookingId: string,
  bookingData: UpdateBookingRequest
): Promise<Booking> => {
  try {
    const processedBookingData: UpdateBookingRequest = {
      ...bookingData,
      booking_time: bookingData.booking_time
        ? bookingData.booking_time instanceof Date
          ? bookingData.booking_time
          : new Date(bookingData.booking_time)
        : undefined,
    };
    const updatedBooking = await updateBooking(bookingId, processedBookingData);
    return {
      ...updatedBooking,
      booking_time:
        typeof updatedBooking.booking_time === "string"
          ? new Date(updatedBooking.booking_time)
          : updatedBooking.booking_time,
    };
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const deleteBookingController = async (
  bookingId: string
): Promise<void> => {
  try {
    await deleteBooking(bookingId);
    toast.success("Booking deleted successfully!");
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const findBookingsByUserIdController = async (userId: string): Promise<Booking> => {
  try {
    const booking = await findBookingsByUserId(userId);
    return booking;
  } catch (error: any) {
    toast.error(error.message);
    console.error(error.message);
    throw error;
  }
};

export const hasActiveBookingController = async (userId: string): Promise<boolean> => {
  try {
    const hasActive = await hasActiveBooking(userId);
    return hasActive;
  } catch (error: any) {
    console.error("Error checking active booking:", error);
    return false; // Return false on error to allow booking
  }
};
