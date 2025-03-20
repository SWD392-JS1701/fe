"use client";

import React, { useState, useEffect, FC } from "react";
import { useSession } from "next-auth/react";
import { getSchedulesByDoctorId } from "@/app/services/scheduleService";
import { fetchDoctorByUserId } from "@/app/controller/doctorController";
import { Doctor } from "@/app/types/doctor";
import Swal from "sweetalert2";
import { initialSchedule } from "@/app/data/initialSchedule";
import { format, startOfWeek, addDays } from "date-fns";
import {
  DndContext,
  closestCorners,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import { getAllUsers } from "@/app/services/userService";
import { getSchedule, updateSlot } from "@/app/services/scheduleService";
import { User } from "@/app/types/user";
interface ScheduleSlot {
  id: string;
  time: string;
  doctorId: string | null;
  doctorName?: string | null;
  specialization?: string | null;
  status?: string;
  date?: Date;
}

interface DaySchedule {
  _id?: string;
  day: string;
  slots: ScheduleSlot[];
}

interface ScheduleSlotProps {
  slot: ScheduleSlot;
}

const ScheduleSlot: FC<ScheduleSlotProps> = ({ slot }) => {
  return (
    <div className="p-3 rounded-lg shadow-sm border bg-gray-50 border-gray-200 transition-colors min-h-16 flex flex-col justify-between">
      <p className="text-sm text-gray-600 font-medium">{slot.time}</p>
      {slot.doctorId && slot.doctorName ? (
        <div className="mt-1 bg-blue-100 p-2 rounded flex-1 flex flex-col">
          <p className="text-blue-800 font-medium">{slot.doctorName}</p>
          <p className="text-xs text-gray-500 truncate">
            {slot.specialization || "Specialization not specified"}
          </p>
        </div>
      ) : (
        <p className="text-gray-400 text-sm italic mt-2 flex-1">
          No schedule
        </p>
      )}
    </div>
  );
};

const SchedulePage: FC = () => {
  const { data: session } = useSession();
  const [schedule, setSchedule] = useState<DaySchedule[]>(initialSchedule);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);
  const [currentWeekDates, setCurrentWeekDates] = useState<Date[]>([]);

  useEffect(() => {
    // Get current week dates
    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Start from Monday
    const weekDates = Array.from({ length: 6 }, (_, i) => 
      addDays(startOfCurrentWeek, i)
    );
    setCurrentWeekDates(weekDates);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!session?.user?.id) {
          throw new Error("No user session found");
        }

        console.log("User ID from session:", session.user.id);

        // Fetch current doctor's information
        const doctorInfo = await fetchDoctorByUserId(session.user.id);
        console.log("Doctor Info:", doctorInfo);
        setCurrentDoctor(doctorInfo);

        if (!doctorInfo?._id) {
          throw new Error("Doctor ID not found");
        }

        // Fetch doctor's complete schedule
        const doctorSchedules = await getSchedulesByDoctorId(doctorInfo._id);
        console.log("Doctor Schedules:", doctorSchedules);

        // Transform the schedules into the required format
        const transformedSchedule = doctorSchedules.map((daySchedule: any, dayIndex: number) => ({
          _id: daySchedule._id,
          day: daySchedule.dayOfWeek,
          slots: daySchedule.slots.map((slot: any) => ({
            id: slot.slotId,
            time: `${slot.startTime} - ${slot.endTime}`,
            doctorId: slot.doctorId || null,
            doctorName: slot.doctorName || null,
            specialization: slot.specialization || null,
            status: slot.status || "available",
            date: currentWeekDates[dayIndex]
          })),
        }));

        // Merge with initialSchedule to maintain correct day order
        const mergedSchedule = initialSchedule.map((defaultDay) => {
          const fetchedDay = transformedSchedule.find(
            (d: DaySchedule) =>
              d.day.toLowerCase() === defaultDay.day.toLowerCase()
          );
          if (fetchedDay) {
            return {
              ...defaultDay,
              _id: fetchedDay._id,
              slots: defaultDay.slots.map((defaultSlot) => {
                const fetchedSlot = fetchedDay.slots.find(
                  (s: ScheduleSlot) => s.id === defaultSlot.id
                );
                return fetchedSlot ? fetchedSlot : defaultSlot;
              }),
            };
          }
          return defaultDay;
        });

        console.log("Final Schedule:", mergedSchedule);
        setSchedule(mergedSchedule);

        if (doctorSchedules.length === 0) {
          Swal.fire({
            icon: "info",
            title: "No Schedule Found",
            text: "You don't have any scheduled appointments yet.",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError(error.message || "Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchData();
    }
  }, [session?.user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-2 text-gray-600">Loading schedule...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 ">
      <div className="w-full bg-white p-4 rounded-lg shadow-md overflow-x-auto pt-25 ">
        {currentDoctor && (
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Weekly Dr. {currentDoctor.name} Schedule
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 min-w-max">
          {schedule.map((day, index) => {
            const isToday = currentWeekDates[index] && 
              format(currentWeekDates[index], 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
            
            return (
              <div 
                key={day.day} 
                className={`border-r last:border-r-0 pb-2 ${
                  isToday ? 'bg-blue-50' : ''
                }`}
              >
                <div className={`text-lg font-semibold text-center mb-3 py-2 sticky top-0 ${
                  isToday ? 'bg-blue-100' : 'bg-gray-50'
                }`}>
                  <div>{day.day}</div>
                  <div className={`text-sm ${
                    isToday ? 'text-blue-600 font-medium' : 'text-gray-600'
                  }`}>
                    {currentWeekDates[index] && 
                      format(currentWeekDates[index], 'MMM dd, yyyy')}
                  </div>
                </div>
                <div className="space-y-3 px-2">
                  {day.slots.map((slot) => (
                    <div key={slot.id} className="relative">
                      <ScheduleSlot slot={slot} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
