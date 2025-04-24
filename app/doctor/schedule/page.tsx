"use client";

import React, { useState, useEffect, FC } from "react";
import { useSession } from "next-auth/react";
import { getSchedulesByDoctorId } from "@/app/services/scheduleService";
import { fetchDoctorByUserId } from "@/app/controller/doctorController";
import { Doctor } from "@/app/types/doctor";
import Swal from "sweetalert2";
import { initialSchedule } from "@/app/data/initialSchedule";
import { format, addDays } from "date-fns";

interface Schedule {
  _id: string;
  dayOfWeek: string;
  slots: ApiScheduleSlot[];
}

interface ApiScheduleSlot {
  startTime: string;
  endTime: string;
  doctorId: string | null;
  doctorName: string | null;
  specialization: string | null;
  status: string;
}

interface ScheduleSlot {
  id: string;
  time: string;
  doctorId: string | null;
  doctorName: string | null;
  specialization: string | null;
  status: string;
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
        <p className="text-gray-400 text-sm italic mt-2 flex-1">No schedule</p>
      )}
    </div>
  );
};

const SchedulePage: FC = () => {
  const { data: session } = useSession();
  const [schedule, setSchedule] = useState<DaySchedule[]>(
    initialSchedule as DaySchedule[]
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);
  const [currentWeekDates, setCurrentWeekDates] = useState<Date[]>([]);

  useEffect(() => {
    // Get dates starting from today and the next 6 days (total 7 days)
    const today = new Date();
    const weekDates = Array.from({ length: 7 }, (_, i) => addDays(today, i));
    setCurrentWeekDates(weekDates);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!session?.user?.id) {
          throw new Error("No user session found");
        }

        // Fetch current doctor's information
        const doctorInfo = await fetchDoctorByUserId(session.user.id);
        setCurrentDoctor(doctorInfo);

        if (!doctorInfo?._id) {
          throw new Error("Doctor ID not found");
        }

        // Fetch doctor's complete schedule
        const doctorSchedules = await getSchedulesByDoctorId(doctorInfo._id);

        // Create a mapping of day names to their schedules
        const scheduleMap = new Map(
          doctorSchedules.map((schedule) => [
            schedule.dayOfWeek.toLowerCase(),
            schedule,
          ])
        );

        // Transform the schedule to start from today
        const transformedSchedule = currentWeekDates.map((date, index) => {
          const dayName = format(date, "EEEE");
          const existingSchedule = scheduleMap.get(dayName.toLowerCase()) as
            | Schedule
            | undefined;

          return {
            _id: existingSchedule?._id || "",
            day: dayName,
            slots: initialSchedule[0].slots.map((slot) => {
              const [startTime, endTime] = slot.time.split(" - ");
              const matchingSlot = existingSchedule?.slots?.find(
                (s) => s.startTime === startTime && s.endTime === endTime
              );

              return {
                id: slot.id,
                time: slot.time,
                doctorId: matchingSlot?.doctorId || null,
                doctorName: matchingSlot?.doctorName || null,
                specialization: matchingSlot?.specialization || null,
                status: matchingSlot?.status || "available",
                date: date,
              };
            }),
          };
        });

        setSchedule(transformedSchedule);

        if (doctorSchedules.length === 0) {
          Swal.fire({
            icon: "info",
            title: "No Schedule Found",
            text: "You do not have any scheduled appointments yet.",
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

    if (session?.user?.id && currentWeekDates.length > 0) {
      fetchData();
    }
  }, [session?.user?.id, currentWeekDates]);

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
            Full Week Schedule - Dr. {currentDoctor.name}
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 min-w-max">
          {schedule.map((day, index) => {
            const isToday = index === 0;
            const date = currentWeekDates[index];

            return (
              <div
                key={day.day}
                className={`border-r last:border-r-0 pb-2 ${
                  isToday ? "bg-blue-50" : ""
                }`}
              >
                <div
                  className={`text-lg font-semibold text-center mb-3 py-2 sticky top-0 ${
                    isToday ? "bg-blue-100" : "bg-gray-50"
                  }`}
                >
                  <div>{day.day}</div>
                  <div
                    className={`text-sm ${
                      isToday ? "text-blue-600 font-medium" : "text-gray-600"
                    }`}
                  >
                    {date && format(date, "MMM dd, yyyy")}
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
