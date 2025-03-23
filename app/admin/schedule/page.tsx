"use client";

import React, { useState, useEffect, FC } from "react";
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
import { format, addDays, isBefore, startOfToday } from "date-fns";

import { getAllDoctors } from "@/app/services/doctorService";
import {
  getSchedule,
  updateSlot,
  updateSchedule,
} from "@/app/services/scheduleService";
import { Doctor } from "@/app/types/doctor";
import { UpdateSchedule } from "@/app/types/schedule";
import Swal from "sweetalert2";
import { initialSchedule } from "@/app/data/initialSchedule";

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

interface DoctorItemProps {
  doctor: Doctor;
}

const DoctorItem: FC<DoctorItemProps> = ({ doctor }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `doctor-${doctor._id}`,
    data: {
      type: "doctor",
      doctor,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-blue-100 p-3 rounded-lg shadow-sm hover:bg-blue-200 transition-colors cursor-move"
    >
      <p className="text-blue-800 font-medium">{doctor.name}</p>
      <p className="text-sm text-gray-600 truncate">
        {doctor.specialties?.join(", ") || "No specialties specified"}
      </p>
    </div>
  );
};

const DraggableDoctorOverlay: FC<{ doctor: Doctor }> = ({ doctor }) => {
  return (
    <div className="bg-blue-200 p-3 rounded-lg shadow-md opacity-90 w-64">
      <p className="text-blue-800 font-medium">{doctor.name}</p>
      <p className="text-sm text-gray-600 truncate">
        {doctor.specialties?.join(", ") || "No specialties specified"}
      </p>
    </div>
  );
};

interface ScheduleSlotProps {
  slot: ScheduleSlot;
  doctors: Doctor[];
  day: string;
}

const ScheduleSlot: FC<ScheduleSlotProps> = ({ slot, day = "" }) => {
  const { setNodeRef, isOver, active } = useDroppable({
    id: `slot-${day.toLowerCase() || "unknown"}-${slot.id}`,
    data: {
      type: "slot",
      slotId: slot.id,
      day: day.toLowerCase() || "unknown",
    },
  });

  const canDrop = active?.data?.current?.type === "doctor";
  const isHighlighted = isOver && canDrop;

  return (
    <div
      ref={setNodeRef}
      className={`p-3 rounded-lg shadow-sm border ${
        isHighlighted
          ? "bg-green-100 border-green-400"
          : slot.doctorId
          ? "bg-blue-50 border-blue-200"
          : "bg-gray-50 border-gray-200"
      } transition-colors min-h-16 flex flex-col justify-between`}
    >
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
          Drop doctor here
        </p>
      )}
    </div>
  );
};

const SchedulePage: FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [schedule, setSchedule] = useState<DaySchedule[]>(initialSchedule);
  const [loading, setLoading] = useState(true);
  const [activeDoctorId, setActiveDoctorId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [changes, setChanges] = useState<
    { day: string; slotId: string; doctorId: string | null }[]
  >([]);
  const [currentWeekDates, setCurrentWeekDates] = useState<Date[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const activeDoctor = activeDoctorId
    ? doctors.find((d) => `doctor-${d._id}` === activeDoctorId) || null
    : null;

  useEffect(() => {
    // Get dates starting from today and the next 6 days (total 7 days)
    const today = new Date();
    const weekDates = Array.from({ length: 7 }, (_, i) => addDays(today, i));
    setCurrentWeekDates(weekDates);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedDoctors = await getAllDoctors();
        setDoctors(fetchedDoctors);

        const apiSchedules = await getSchedule();
        if (!Array.isArray(apiSchedules)) {
          throw new Error("Invalid schedule data: Expected an array.");
        }

        // Create a mapping of day names to their schedules
        const scheduleMap = new Map(
          apiSchedules.map(schedule => [schedule.dayOfWeek.toLowerCase(), schedule])
        );

        // Transform the schedule to start from today
        const transformedSchedule = currentWeekDates.map((date, index) => {
          const dayName = format(date, 'EEEE');
          const existingSchedule = scheduleMap.get(dayName.toLowerCase());

          return {
            _id: existingSchedule?._id,
            day: dayName,
            slots: initialSchedule[0].slots.map(slot => {
              const matchingSlot = existingSchedule?.slots.find((s: ApiScheduleSlot) => 
                s.startTime === slot.time.split(' - ')[0] && 
                s.endTime === slot.time.split(' - ')[1]
              );

              return {
                id: slot.id,
                time: slot.time,
                doctorId: matchingSlot?.doctorId || null,
                doctorName: matchingSlot?.doctorName || null,
                specialization: matchingSlot?.specialization || null,
                status: matchingSlot?.status || "available",
                date: date
              };
            })
          };
        });

        // Update schedule dates in the database
        for (const daySchedule of transformedSchedule) {
          if (daySchedule._id) {
            try {
              const updateData: UpdateSchedule = {
                date: format(daySchedule.slots[0].date, 'yyyy-MM-dd'),
                dayOfWeek: daySchedule.day
              };
              await updateSchedule(daySchedule._id, updateData);
            } catch (error) {
              console.error(`Error updating schedule for ${daySchedule.day}:`, error);
            }
          }
        }

        setSchedule(transformedSchedule);

      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError(error.message || "Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (currentWeekDates.length > 0) {
      fetchData();
    }
  }, [currentWeekDates]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveDoctorId(active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDoctorId(null);

    if (!over || !over.id) {
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    if (!activeId.startsWith("doctor-") || !overId.startsWith("slot-")) {
      return;
    }

    const doctorId = activeId.replace("doctor-", "");
    const parts = overId.split("-");
    const day = parts[1];
    const slotId = parts.slice(2).join("-");

    const updatedSchedule = schedule.map((daySchedule, dayIndex) => {
      if (daySchedule.day.toLowerCase() === day) {
        const updatedSlots = daySchedule.slots.map((slot) => {
          if (slot.id === slotId) {
            const assignedDoctor = doctors.find((d) => d._id === doctorId);
            return {
              ...slot,
              doctorId,
              doctorName: assignedDoctor ? assignedDoctor.name : null,
              specialization:
                assignedDoctor?.specialties?.join(", ") ||
                "No specialties specified",
              status: "available",
              date: currentWeekDates[dayIndex],
            };
          }
          return slot;
        });
        return { ...daySchedule, slots: [...updatedSlots] };
      }
      return { ...daySchedule };
    });

    setSchedule(updatedSchedule);
    setChanges([...changes, { day, slotId, doctorId }]);
  };

  const handleClearSlot = async (day: string, slotId: string) => {
    const updatedSchedule = schedule.map((daySchedule) => {
      if (daySchedule.day.toLowerCase() === day.toLowerCase()) {
        const updatedSlots = daySchedule.slots.map((slot) => {
          if (slot.id === slotId) {
            return {
              ...slot,
              doctorId: null,
              doctorName: null,
              specialization: null,
              status: "available",
            };
          }
          return slot;
        });
        return { ...daySchedule, slots: [...updatedSlots] };
      }
      return { ...daySchedule };
    });

    setSchedule(updatedSchedule);
    setChanges([...changes, { day, slotId, doctorId: null }]);
  };

  const handleSaveChanges = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      for (const change of changes) {
        const daySchedule = schedule.find(
          (d) => d.day.toLowerCase() === change.day.toLowerCase()
        );
        const updatedSlot = daySchedule?.slots.find(
          (s) => s.id === change.slotId
        );

        if (updatedSlot && daySchedule?._id) {
          console.log("updatedSlot ",updatedSlot)
          console.log("daySchedule?._id",daySchedule?._id)
          await updateSlot(daySchedule._id, change.slotId, {
            doctorId: updatedSlot.doctorId,
            doctorName: updatedSlot.doctorName,
            specialization: updatedSlot.specialization,
            status: updatedSlot.status,
            
          });
        }
      }

      Swal.fire({
        icon: "success",
        title: "Changes saved successfully",
        showConfirmButton: false,
        timer: 1500,
      });

      setChanges([]); // Clear changes after saving
    } catch (error: any) {
      console.error("Error saving changes:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to save changes",
        text: error.message,
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-2 text-gray-600">Loading data...</p>
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
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 mt-30">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6">
        Doctor Schedule Management
      </h1>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar: Doctors List */}
          <div className="w-full lg:w-1/6 bg-white p-4 rounded-lg shadow-md">
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Available Doctors
            </h2>
            {/* Save Button */}
            <div className=" pb-4 ">
              <button
                onClick={handleSaveChanges}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors"
              >
                Save Changes
              </button>
            </div>
            <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
              {doctors.length === 0 ? (
                <p className="text-gray-500 italic">No doctors available.</p>
              ) : (
                doctors.map((doctor) => (
                  <DoctorItem key={doctor._id} doctor={doctor} />
                ))
              )}
            </div>
          </div>

          {/* Right Side: Calendar */}
          <div className="w-full lg:w-5/6 bg-white p-4 rounded-lg shadow-md overflow-x-auto">
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
              Full Week Schedule (Starting Today)
            </h2>

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
                      <div className={`text-sm ${
                        isToday ? 'text-blue-600 font-medium' : 'text-gray-600'
                      }`}>
                        {date && format(date, 'MMM dd, yyyy')}
                      </div>
                    </div>
                    <div className="space-y-3 px-2">
                      {day.slots.map((slot) => (
                        <div key={slot.id} className="relative">
                          <>
                            <ScheduleSlot
                              slot={slot}
                              doctors={doctors}
                              day={day.day}
                            />
                            {slot.doctorId && (
                              <button
                                onClick={() =>
                                  handleClearSlot(day.day, slot.id)
                                }
                                className="absolute top-1 right-1 bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-1"
                                title="Remove assignment"
                              >
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            )}
                          </>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeDoctor ? (
            <DraggableDoctorOverlay doctor={activeDoctor} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default SchedulePage;
