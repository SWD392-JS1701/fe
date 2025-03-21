import {
  getSchedule,
  getScheduleById,
  updateSchedule,
  updateSlot,
  getSlot,
  getSlotOfWeek,
  getScheduleSlotsByDoctorId,
  getSchedulesByDoctorId,
} from "@/app/services/scheduleService";
import { toast } from "react-hot-toast";
import { Schedule } from "../types/schedule";

export const fetchAllSchedules = async () => {
  try {
    const schedules = await getSchedule();
    return schedules;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const fetchScheduleById = async (id: string) => {
  try {
    const schedule = await getScheduleById(id);
    return schedule;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const updateExistingSchedule = async (
  id: string,
  schedule: Schedule
) => {
  try {
    const updatedSchedule = await updateSchedule(id, schedule);
    toast.success("Schedule updated successfully!");
    return updatedSchedule;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const updateExistingSlot = async (
  id: string,
  slotId: string,
  slot: any
) => {
  try {
    const updatedSlot = await updateSlot(id, slotId, slot);
    toast.success("Slot updated successfully!");
    return updatedSlot;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const fetchSlot = async (dateOfWeek: string, slotId: string) => {
  try {
    const slot = await getSlot(dateOfWeek, slotId);
    return slot;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const fetchSlotOfWeek = async (dateOfWeek: string, slotId: string) => {
  try {
    const slot = await getSlotOfWeek(dateOfWeek, slotId);
    return slot;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const fetchScheduleSlotsByDoctorId = async (doctorId: string) => {
  try {
    const schedule = await getScheduleSlotsByDoctorId(doctorId);
    return schedule;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const fetchSchedulesByDoctorId = async (doctorId: string) => {
  try {
    const schedules = await getSchedulesByDoctorId(doctorId);
    return schedules;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};
