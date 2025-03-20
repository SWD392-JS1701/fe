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
import { fetchScheduleSlotsByDoctorId } from "@/app/controller/scheduleController";

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
    if (isOpen && doctor?._id) {
      const fetchData = async () => {
        setLoadingSlots(true);
        try {
          const scheduleData = await fetchScheduleSlotsByDoctorId(doctor._id);
          console.log("Schedule",scheduleData);
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
        slot.doctorId === doctor?._id && slot.dayOfWeek === dayOfWeek
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
                src={
                  "https://th.bing.com/th/id/R.c01bfe8e1f11dfe3a1af580cfa3bbc89?rik=4XJslhCYu9u8CA&riu=http%3a%2f%2fhakomed.net%2fwp-content%2fuploads%2f2018%2f11%2f03.jpg&ehk=hVGis2mazsfZKbGSNt2KebgoX7%2b9lh%2bIUJTdYnIiXic%3d&risl=&pid=ImgRaw&r=0"
                }
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
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
                .filter(day => slots.some(slot => slot.dayOfWeek === day))
                .map((day) => (
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
                ))}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {loadingSlots ? (
                <p>Loading slots...</p>
              ) : (
                console.log("Slots for selected date:", getDaySlots(selectedDate)),
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
              className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedTime}
              className={`px-4 py-2 rounded-md transition-all duration-200 ${
                selectedTime 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-md hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {selectedTime ? 'Continue Booking' : 'Select a Time Slot'}
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
