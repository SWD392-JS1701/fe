// components/BookingModal.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Doctor } from "../app/types/doctor";
import InstructionNotification from "./InstructionNotification";

interface BookingModalProps {
  doctor: Doctor;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedSlot: { date: string; time: string }) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({
  doctor,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  // Sample slots (in a real app, fetch these from an API)
  const slots = [
    { date: "Tomorrow", time: "10:00 AM", status: "Available" },
    { date: "Tomorrow", time: "10:15 AM", status: "Available" },
    { date: "Tomorrow", time: "10:30 AM", status: "Booked" },
    { date: "Tomorrow", time: "10:45 AM", status: "Available" },
    { date: "Tomorrow", time: "11:00 AM", status: "Available" },
    { date: "Tomorrow", time: "11:15 AM", status: "Available" },
    { date: "Tomorrow", time: "11:30 AM", status: "Available" },
    { date: "Tomorrow", time: "11:45 AM", status: "Available" },
  ];

  const [selectedDate, setSelectedDate] = useState<string>("Tomorrow");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time when date changes
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirm = () => {
    if (selectedTime) {
      setShowInstructions(true); // Show instructions instead of closing immediately
    }
  };

  const handleInstructionsClose = () => {
    setShowInstructions(false);
    onConfirm({ date: selectedDate, time: selectedTime! }); // Pass the selected slot to the parent
    onClose(); // Close the modal after instructions
  };

  return (
    <>
      <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-lg font-semibold">Pick a time slot</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
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
          </div>
          <div className="bg-blue-50 p-4 rounded-md mb-4">
            <div className="flex items-center space-x-4">
              <Image
                src={doctor.profilePicture || "/images/default-doctor.jpg"}
                alt={doctor.name}
                width={50}
                height={50}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-semibold">{doctor.name}</h3>
                <p className="text-sm text-gray-600">{doctor.certification}</p>
                <p className="text-sm text-gray-500">
                  {doctor.location}, United States
                </p>
              </div>
            </div>
            <p className="text-sm mt-2">
              ${doctor.consultationFee} Consultation Fee at clinic
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date & Time Slot
            </label>
            <div className="flex space-x-2 mb-2 overflow-x-auto">
              {[
                "Today",
                "Tomorrow",
                "Fri, 22 Mar",
                "Sat, 23 Mar",
                "Sun, 24 Mar",
                "Tue, 26 Mar",
              ].map((date) => (
                <button
                  key={date}
                  className={`px-3 py-1 rounded-md text-sm ${
                    selectedDate === date
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  } whitespace-nowrap`}
                  onClick={() => handleDateSelect(date)}
                >
                  {date}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {slots
                .filter((slot) => slot.date === selectedDate)
                .map((slot, index) => (
                  <button
                    key={index}
                    className={`px-3 py-1 rounded-md text-sm ${
                      selectedTime === slot.time
                        ? "bg-green-500 text-white"
                        : slot.status === "Booked"
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-200 text-green-800 hover:bg-green-300"
                    }`}
                    disabled={slot.status === "Booked"}
                    onClick={() => handleTimeSelect(slot.time)}
                  >
                    {slot.time}
                    {slot.status === "Booked" && " (Booked)"}
                  </button>
                ))}
            </div>
            <p className="text-xs text-gray-500 mt-2 flex justify-center gap-2">
              <span className="bg-green-200 text-green-800 px-2 py-1 rounded">
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
          <div className="flex justify-end space-x-4">
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
          </div>
        </div>
      </div>
      {showInstructions && (
        <InstructionNotification onClose={handleInstructionsClose} />
      )}
    </>
  );
};

export default BookingModal;
