import axios from "axios";
import { API_URL } from "@/config";

export interface Doctor {
  _id?: string;
  user_Id: string;
  certification: string;
  schedule: string;
  description: string;
}

export const getAllDoctors = async (): Promise<Doctor[]> => {
  try {
    const response = await axios.get(`${API_URL}/doctors`);
    return response.data;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return [];
  }
};

export const getDoctorById = async (
  doctorId: string
): Promise<Doctor | null> => {
  try {
    const response = await axios.get(`${API_URL}/doctors/${doctorId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching doctor details:", error);
    return null;
  }
};

export const createDoctor = async (doctor: Doctor): Promise<Doctor | null> => {
  try {
    const response = await axios.post(`${API_URL}/doctors`, doctor, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating doctor:", error);
    return null;
  }
};

export const updateDoctor = async (
  doctorId: string,
  doctor: Doctor
): Promise<Doctor | null> => {
  try {
    const response = await axios.patch(
      `${API_URL}/doctors/${doctorId}`,
      doctor,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating doctor:", error);
    return null;
  }
};

export const deleteDoctor = async (doctorId: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/doctors/${doctorId}`);
  } catch (error) {
    console.error("Error deleting doctor:", error);
  }
};
