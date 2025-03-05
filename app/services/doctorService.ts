import axiosInstance from "./axiosInstance"; // Import axiosInstance
import { Doctor } from "../types/doctor";

export const getAllDoctors = async (): Promise<Doctor[]> => {
  try {
    const response = await axiosInstance.get("/doctors");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching doctors:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch doctors. Please try again."
    );
  }
};

export const getDoctorById = async (
  doctorId: string
): Promise<Doctor | null> => {
  try {
    const response = await axiosInstance.get(`/doctors/${doctorId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching doctor details:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch doctor details. Please try again."
    );
  }
};

export const createDoctor = async (doctor: Doctor): Promise<Doctor | null> => {
  try {
    const response = await axiosInstance.post("/doctors", doctor, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error creating doctor:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to create doctor. Please try again."
    );
  }
};

export const updateDoctor = async (
  doctorId: string,
  doctor: Doctor
): Promise<Doctor | null> => {
  try {
    const response = await axiosInstance.patch(`/doctors/${doctorId}`, doctor, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error updating doctor:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to update doctor. Please try again."
    );
  }
};

export const deleteDoctor = async (doctorId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/doctors/${doctorId}`);
  } catch (error: any) {
    console.error("Error deleting doctor:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to delete doctor. Please try again."
    );
  }
};
