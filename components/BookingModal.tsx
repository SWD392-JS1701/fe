"use client";

import React, { FC, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import InstructionNotification from "./InstructionNotification";

import { Doctor } from "../app/types/doctor";
import { ScheduleSlot } from "@/app/types/schedule";
import { fetchScheduleByDoctorId } from "@/app/controller/scheduleController";

interface BookingModalProps {
  doctor: Doctor;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedSlot: { date: string; time: string }) => void;
}

const BookingModal: FC<BookingModalProps> = ({
  doctor,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [slots, setSlots] = useState<ScheduleSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("Tomorrow");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    if (isOpen && doctor?.user_Id) {
      const fetchData = async () => {
        setLoadingSlots(true);
        try {
          const scheduleData = await fetchScheduleByDoctorId(doctor.user_Id);
          setSlots(scheduleData);
        } catch (error) {
          console.error("Failed to fetch data:", error);
          toast.error("Failed to load schedule");
        } finally {
          setLoadingSlots(false);
        }
      };
      fetchData();
    }
  }, [isOpen, doctor?._id]);

  const getDaySlots = (dayOfWeek: string) => {
    return slots.filter(
      (slot) =>
        slot.doctorId === doctor?.user_Id && slot.dayOfWeek === dayOfWeek
    );
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirm = () => {
    if (!selectedTime) {
      toast.error("Please select a time slot to continue");
      return;
    }
    onClose();
    setShowInstructions(true);
  };

  const handleInstructionsClose = () => {
    setShowInstructions(false);
    onConfirm({
      date: selectedDate,
      time: selectedTime!,
    });
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="min-w-3xl">
          <DialogHeader>
            <DialogTitle>Pick a time slot and combo</DialogTitle>
          </DialogHeader>
          <div className="bg-blue-50 p-4 rounded-md mb-4">
            <div className="flex items-center space-x-4">
              <Image
                src={doctor?.profilePicture || "/images/default-doctor.jpg"}
                alt={doctor?.name}
                width={50}
                height={50}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-semibold">{doctor?.name}</h3>
                <p className="text-sm text-gray-600">{doctor?.certification}</p>
              </div>
            </div>
          </div>

          {/* Date and Time Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date & Time Slot
            </label>
            <div className="flex space-x-2 mb-2 overflow-x-auto">
              {Array.from(new Set(slots.map((slot) => slot.dayOfWeek))).map(
                (day) => (
                  <button
                    key={day}
                    className={`px-3 py-1 rounded-md text-sm ${
                      selectedDate === day
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    } whitespace-nowrap`}
                    onClick={() => handleDateSelect(day)}
                  >
                    {day}
                  </button>
                )
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {loadingSlots ? (
                <p>Loading slots...</p>
              ) : (
                getDaySlots(selectedDate).map((slot) => (
                  <button
                    key={slot._id}
                    className={`px-3 py-1 rounded-md text-sm ${
                      selectedTime === slot.startTime
                        ? "bg-green-500 text-white"
                        : slot.status === "booked"
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-200 text-green-800 hover:bg-green-300"
                    }`}
                    disabled={slot.status === "booked"}
                    onClick={() => handleTimeSelect(slot.startTime)}
                  >
                    {`${slot.startTime} - ${slot.endTime}`}
                    {slot.status === "booked" ? " (Booked)" : " (Available)"}
                  </button>
                ))
              )}
            </div>

            <p className="text-xs text-gray-500 mt-2 flex justify-center gap-2">
              <span className="bg-green-500 text-white px-2 py-1 rounded">
                Selected
              </span>
              <span className="bg-gray-300 text-gray-500 px-2 py-1 rounded">
                Booked
              </span>
              <span className="bg-green-200 text-green-800 px-2 py-1 rounded">
                Available
              </span>
            </p>
          </div>

          <DialogFooter>
            <button
              onClick={onClose}
              className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              disabled={!selectedTime}
            >
              Continue
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {showInstructions && (
        <InstructionNotification onClose={handleInstructionsClose} />
      )}
    </>
  );
};

export default BookingModal;
