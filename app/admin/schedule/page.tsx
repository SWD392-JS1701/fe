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
import { getAllUsers, User } from "@/app/services/userService";

interface ScheduleSlot {
  id: string;
  time: string;
  doctorId: string | null;
}

interface DaySchedule {
  day: string;
  slots: ScheduleSlot[];
}

const initialSchedule: DaySchedule[] = [
  {
    day: "Monday",
    slots: [
      { id: "mon-1", time: "9:00 AM - 10:00 AM", doctorId: null },
      { id: "mon-2", time: "10:00 AM - 11:00 AM", doctorId: null },
      { id: "mon-3", time: "11:00 AM - 12:00 PM", doctorId: null },
      { id: "mon-4", time: "1:00 PM - 2:00 PM", doctorId: null },
      { id: "mon-5", time: "2:00 PM - 3:00 PM", doctorId: null },
      { id: "mon-6", time: "3:00 PM - 4:00 PM", doctorId: null },
    ],
  },
  {
    day: "Tuesday",
    slots: [
      { id: "tue-1", time: "9:00 AM - 10:00 AM", doctorId: null },
      { id: "tue-2", time: "10:00 AM - 11:00 AM", doctorId: null },
      { id: "tue-3", time: "11:00 AM - 12:00 PM", doctorId: null },
      { id: "tue-4", time: "1:00 PM - 2:00 PM", doctorId: null },
      { id: "tue-5", time: "2:00 PM - 3:00 PM", doctorId: null },
      { id: "tue-6", time: "3:00 PM - 4:00 PM", doctorId: null },
    ],
  },
  {
    day: "Wednesday",
    slots: [
      { id: "wed-1", time: "9:00 AM - 10:00 AM", doctorId: null },
      { id: "wed-2", time: "10:00 AM - 11:00 AM", doctorId: null },
      { id: "wed-3", time: "11:00 AM - 12:00 PM", doctorId: null },
      { id: "wed-4", time: "1:00 PM - 2:00 PM", doctorId: null },
      { id: "wed-5", time: "2:00 PM - 3:00 PM", doctorId: null },
      { id: "wed-6", time: "3:00 PM - 4:00 PM", doctorId: null },
    ],
  },
  {
    day: "Thursday",
    slots: [
      { id: "thu-1", time: "9:00 AM - 10:00 AM", doctorId: null },
      { id: "thu-2", time: "10:00 AM - 11:00 AM", doctorId: null },
      { id: "thu-3", time: "11:00 AM - 12:00 PM", doctorId: null },
      { id: "thu-4", time: "1:00 PM - 2:00 PM", doctorId: null },
      { id: "thu-5", time: "2:00 PM - 3:00 PM", doctorId: null },
      { id: "thu-6", time: "3:00 PM - 4:00 PM", doctorId: null },
    ],
  },
  {
    day: "Friday",
    slots: [
      { id: "fri-1", time: "9:00 AM - 10:00 AM", doctorId: null },
      { id: "fri-2", time: "10:00 AM - 11:00 AM", doctorId: null },
      { id: "fri-3", time: "11:00 AM - 12:00 PM", doctorId: null },
      { id: "fri-4", time: "1:00 PM - 2:00 PM", doctorId: null },
      { id: "fri-5", time: "2:00 PM - 3:00 PM", doctorId: null },
      { id: "fri-6", time: "3:00 PM - 4:00 PM", doctorId: null },
    ],
  },
  {
    day: "Saturday",
    slots: [
      { id: "sat-1", time: "9:00 AM - 10:00 AM", doctorId: null },
      { id: "sat-2", time: "10:00 AM - 11:00 AM", doctorId: null },
      { id: "sat-3", time: "11:00 AM - 12:00 PM", doctorId: null },
    ],
  },
  {
    day: "Sunday",
    slots: [
      { id: "sun-1", time: "9:00 AM - 10:00 AM", doctorId: null },
      { id: "sun-2", time: "10:00 AM - 11:00 AM", doctorId: null },
      { id: "sun-3", time: "11:00 AM - 12:00 PM", doctorId: null },
    ],
  },
];

// Doctor Item Component (Draggable)
interface DoctorItemProps {
  doctor: User;
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
      <p className="text-blue-800 font-medium">
        {doctor.first_name} {doctor.last_name}
      </p>
      <p className="text-sm text-gray-600 truncate">{doctor.email}</p>
    </div>
  );
};

// Component for drag overlay
const DraggableDoctorOverlay: FC<{ doctor: User }> = ({ doctor }) => {
  return (
    <div className="bg-blue-200 p-3 rounded-lg shadow-md opacity-90 w-64">
      <p className="text-blue-800 font-medium">
        {doctor.first_name} {doctor.last_name}
      </p>
      <p className="text-sm text-gray-600 truncate">{doctor.email}</p>
    </div>
  );
};

// Schedule Slot Component (Droppable using useDroppable)
interface ScheduleSlotProps {
  slot: ScheduleSlot;
  doctors: User[];
  day: string;
}

const ScheduleSlot: FC<ScheduleSlotProps> = ({ slot, doctors, day }) => {
  const { setNodeRef, isOver, active } = useDroppable({
    id: `slot-${day.toLowerCase()}-${slot.id}`,
    data: {
      type: "slot",
      slotId: slot.id,
      day: day.toLowerCase(),
    },
  });

  const assignedDoctor = slot.doctorId
    ? doctors.find((d) => d._id === slot.doctorId)
    : null;

  const canDrop = active?.data?.current?.type === "doctor";
  const isHighlighted = isOver && canDrop;

  return (
    <div
      ref={setNodeRef}
      className={`p-3 rounded-lg shadow-sm border ${
        isHighlighted
          ? "bg-green-100 border-green-400"
          : assignedDoctor
          ? "bg-blue-50 border-blue-200"
          : "bg-gray-50 border-gray-200"
      } transition-colors min-h-16 flex flex-col justify-between`}
    >
      <p className="text-sm text-gray-600 font-medium">{slot.time}</p>
      {assignedDoctor ? (
        <div className="mt-1 bg-blue-100 p-2 rounded flex-1 flex flex-col">
          <p className="text-blue-800 font-medium">
            {assignedDoctor.first_name} {assignedDoctor.last_name}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {assignedDoctor.email}
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

// Main SchedulePage Component
const SchedulePage: FC = () => {
  const [doctors, setDoctors] = useState<User[]>([]);
  const [schedule, setSchedule] = useState<DaySchedule[]>(initialSchedule);
  const [loading, setLoading] = useState(true);
  const [activeDoctorId, setActiveDoctorId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // Find active doctor for drag overlay
  const activeDoctor = activeDoctorId
    ? doctors.find((d) => `doctor-${d._id}` === activeDoctorId) || null
    : null;

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const users = await getAllUsers();
        const doctorUsers = users.filter((user) => user.role === "Doctor");
        setDoctors(doctorUsers);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveDoctorId(active.id as string);
    console.log("Drag started:", active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDoctorId(null);

    console.log("Drag ended:", { active: active.id, over: over?.id });

    if (!over || !over.id) {
      console.log("No drop target found");
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    if (!activeId.startsWith("doctor-") || !overId.startsWith("slot-")) {
      console.log("Invalid drag-to-drop pair:", { activeId, overId });
      return;
    }

    const doctorId = activeId.replace("doctor-", "");
    const parts = overId.split("-");
    const day = parts[1]; // e.g., "monday"
    const slotId = parts.slice(2).join("-"); // e.g., "mon-1"

    console.log("Dropping doctor:", { doctorId, day, slotId });

    // Update the schedule with a deep copy to ensure re-rendering
    setSchedule((prevSchedule) => {
      const newSchedule = prevSchedule.map((daySchedule) => {
        if (daySchedule.day.toLowerCase() === day) {
          const updatedSlots = daySchedule.slots.map((slot) => {
            if (slot.id === slotId) {
              // Compare slot.id directly with slotId
              console.log(`Assigning doctor ${doctorId} to slot ${slotId}`);
              return { ...slot, doctorId };
            }
            return slot;
          });
          return { ...daySchedule, slots: [...updatedSlots] };
        }
        return { ...daySchedule };
      });
      console.log("Updated schedule:", newSchedule);
      return newSchedule;
    });
  };

  const handleClearSlot = (day: string, slotId: string) => {
    setSchedule((prevSchedule) => {
      const newSchedule = prevSchedule.map((daySchedule) => {
        if (daySchedule.day.toLowerCase() === day.toLowerCase()) {
          const updatedSlots = daySchedule.slots.map((slot) => {
            if (slot.id === slotId) {
              return { ...slot, doctorId: null };
            }
            return slot;
          });
          return { ...daySchedule, slots: [...updatedSlots] };
        }
        return { ...daySchedule };
      });
      console.log("Cleared slot, updated schedule:", newSchedule);
      return newSchedule;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-2 text-gray-600">Loading doctors...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6">
        Doctor Schedule Management
      </h1>

      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <p className="text-gray-600">
          Drag doctors from the left panel and drop them into time slots to
          create the weekly schedule. The same doctor can be assigned to
          multiple slots.
          {doctors.length === 0 &&
            " No doctors found. Please add doctors with the 'Doctor' role."}
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar: Doctors List */}
          <div className="w-full lg:w-1/4 bg-white p-4 rounded-lg shadow-md">
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
          <div className="w-full lg:w-3/4 bg-white p-4 rounded-lg shadow-md overflow-x-auto">
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
              Weekly Schedule
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 min-w-max">
              {schedule.map((day) => (
                <div key={day.day} className="border-r last:border-r-0 pb-2">
                  <h3 className="text-lg font-semibold text-center mb-3 bg-gray-50 py-2 sticky top-0">
                    {day.day}
                  </h3>
                  <div className="space-y-3 px-2">
                    {day.slots.map((slot) => (
                      <div key={slot.id} className="relative">
                        <ScheduleSlot
                          slot={slot}
                          doctors={doctors}
                          day={day.day}
                        />
                        {slot.doctorId && (
                          <button
                            onClick={() => handleClearSlot(day.day, slot.id)}
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
                      </div>
                    ))}
                  </div>
                </div>
              ))}
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
