import axiosInstance from "./axiosInstance";
import {
  Booking,
  CreateBookingRequest,
  UpdateBookingRequest,
} from "../types/booking";

export const getAllBookings = async (): Promise<Booking[]> => {
  try {
    const response = await axiosInstance.get("/bookings");
    return response.data as Booking[];
  } catch (error: any) {
    console.error("Booking API Error:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch bookings. Please try again."
    );
  }
};

export const getBookingById = async (bookingId: string): Promise<Booking> => {
  try {
    const response = await axiosInstance.get(`/bookings/${bookingId}`);
    return response.data as Booking;
  } catch (error: any) {
    console.error("Booking API Error:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch booking. Please try again."
    );
  }
};

export const createBooking = async (
  bookingData: CreateBookingRequest
): Promise<Booking> => {
  try {
    const requestData = {
      ...bookingData,
      booking_time: bookingData.booking_time.toISOString(),
    };
    const response = await axiosInstance.post("/bookings", requestData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data as Booking;
  } catch (error: any) {
    console.error("Booking API Error:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to create booking. Please try again."
    );
  }
};

export const updateBooking = async (
  bookingId: string,
  bookingData: UpdateBookingRequest
): Promise<Booking> => {
  try {
    // Convert booking_time to ISO string if it exists
    const requestData = {
      ...bookingData,
      booking_time: bookingData.booking_time
        ? bookingData.booking_time.toISOString()
        : undefined,
    };
    const response = await axiosInstance.put(
      `/bookings/${bookingId}`,
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data as Booking;
  } catch (error: any) {
    console.error("Booking API Error:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to update booking. Please try again."
    );
  }
};

export const deleteBooking = async (bookingId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/bookings/${bookingId}`);
  } catch (error: any) {
    console.error("Booking API Error:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to delete booking. Please try again."
    );
  }
};
