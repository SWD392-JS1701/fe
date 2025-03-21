import axiosInstance from "./axiosInstance";
import { Schedule, ScheduleSlot, UpdateSchedule } from "../types/schedule";

export const getSchedule = async () => {
  try {
    const response = await axiosInstance.get("/schedules");
    return response.data;
  } catch (error: any) {
    console.error("Schedule API Error:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch schedule. Please try again."
    );
  }
};

export const getScheduleById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/schedules/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Schedule API Error:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch schedule. Please try again."
    );
  }
};

export const updateSchedule = async (id: string, schedule: UpdateSchedule) => {
  try {
    const response = await axiosInstance.put(`/schedules/${id}`, schedule);
    return response.data;
  } catch (error: any) {
    console.error("Schedule API Error:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to update schedule. Please try again."
    );
  }
};

export const updateSlot = async (id: string, slotId: string, slot: any) => {
  try {
    const response = await axiosInstance.put(
      `/schedules/${id}/slots/${slotId}`,
      slot
    );
    return response.data;
  } catch (error: any) {
    console.error("Slot API Error:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to update slot. Please try again."
    );
  }
};

export const getSlot = async (dateOfWeek: string, slotId: string) => {
  try {
    const response = await axiosInstance.get(
      `/schedules/${dateOfWeek}/slots/${slotId}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Slot API Error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch slot. Please try again."
    );
  }
};

export const getSlotOfWeek = async (dateOfWeek: string, slotId: string) => {
  try {
    const response = await axiosInstance.get(
      `/schedules/${dateOfWeek}/slots/${slotId}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Slot API Error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch slot. Please try again."
    );
  }
};
//return slot of the doctor
export const getScheduleSlotsByDoctorId = async (
  id: string
): Promise<ScheduleSlot[]> => {
  try {
    const response = await axiosInstance.get(`/schedules/slots/doctor/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Schedule API Error:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch schedule. Please try again."
    );
  }
};

export const getSchedulesByDoctorId = async (doctorId: string): Promise<Schedule[]> => {
  try {
    const response = await axiosInstance.get(`/schedules/doctor/${doctorId}/schedules`);
    return response.data;
  } catch (error: any) {
    console.error("Schedule API Error:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch schedule. Please try again."
    );
  }
};
