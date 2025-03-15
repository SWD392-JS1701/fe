import {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from "@/app/services/doctorService";
import { toast } from "react-hot-toast";
import { Doctor } from "../types/doctor";

export const fetchAllDoctors = async (): Promise<Doctor[]> => {
  try {
    const doctors = await getAllDoctors();
    return doctors;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const fetchDoctorById = async (
  doctorId: string
): Promise<Doctor | null> => {
  try {
    const doctor = await getDoctorById(doctorId);
    return doctor;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const createNewDoctor = async (
  doctor: Doctor
): Promise<Doctor | null> => {
  try {
    const newDoctor = await createDoctor(doctor);
    toast.success("Doctor created successfully!");
    return newDoctor;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const updateExistingDoctor = async (
  doctorId: string,
  doctor: Doctor
): Promise<Doctor | null> => {
  try {
    const updatedDoctor = await updateDoctor(doctorId, doctor);
    toast.success("Doctor updated successfully!");
    return updatedDoctor;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const deleteExistingDoctor = async (doctorId: string): Promise<void> => {
  try {
    await deleteDoctor(doctorId);
    toast.success("Doctor deleted successfully!");
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};
