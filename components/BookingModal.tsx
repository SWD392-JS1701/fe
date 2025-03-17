"use client";

import React, { FC, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { Doctor } from "../app/types/doctor";
import { Combo } from "../app/types/combo";
import { getAllCombosController } from "@/app/controller/comboController";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import InstructionNotification from "./InstructionNotification";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BookingModalProps {
  doctor: Doctor;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedSlot: {
    date: string;
    time: string;
    comboId: string;
  }) => void;
}

const BookingModal: FC<BookingModalProps> = ({
  doctor,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const slots = [
    { date: "Tuesday", time: "10:00 AM", status: "Available" },
    { date: "Tuesday", time: "10:15 AM", status: "Available" },
    { date: "Tuesday", time: "10:30 AM", status: "Booked" },
    { date: "Tuesday", time: "10:45 AM", status: "Available" },
    { date: "Tuesday", time: "11:00 AM", status: "Available" },
    { date: "Tuesday", time: "11:15 AM", status: "Available" },
    { date: "Tuesday", time: "11:30 AM", status: "Available" },
    { date: "Tuesday", time: "11:45 AM", status: "Available" },
  ];

  const [selectedDate, setSelectedDate] = useState<string>("Tomorrow");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedCombo, setSelectedCombo] = useState<string | null>(null);
  const [combos, setCombos] = useState<Combo[]>([]);
  const [showInstructions, setShowInstructions] = useState(false);
  const [loadingCombos, setLoadingCombos] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchCombos = async () => {
        setLoadingCombos(true);
        try {
          const fetchedCombos = await getAllCombosController();
          setCombos(fetchedCombos);
          if (fetchedCombos.length > 0) {
            setSelectedCombo(fetchedCombos[0]._id!);
          }
        } catch (error) {
          console.error("Failed to fetch combos:", error);
        } finally {
          setLoadingCombos(false);
        }
      };
      fetchCombos();
    }
  }, [isOpen]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleComboSelect = (comboId: string) => {
    setSelectedCombo(comboId);
  };

  const handleConfirm = () => {
    if (!selectedTime) {
      toast.error("Please select a time slot to continue");
      return;
    }
    if (!selectedCombo) {
      toast.error("Please select a combo to continue");
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
      comboId: selectedCombo!,
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
                <p className="text-sm text-gray-500">
                  {doctor?.location}, United States
                </p>
              </div>
            </div>
            <p className="text-sm mt-2">
              ${doctor?.consultationFee} Consultation Fee at clinic
            </p>
          </div>

          {/* Combo Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Combo
            </label>
            {loadingCombos ? (
              <p>Loading combos...</p>
            ) : combos.length === 0 ? (
              <p>No combos available.</p>
            ) : (
              <Select
                value={selectedCombo || ""}
                onValueChange={handleComboSelect}
                disabled={loadingCombos}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a combo" />
                </SelectTrigger>
                <SelectContent>
                  {combos.map((combo) => (
                    <SelectItem key={combo._id} value={combo._id!}>
                      {`${combo.name} - ${combo.type} ($${combo.price})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Date and Time Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date & Time Slot
            </label>
            <div className="flex space-x-2 mb-2 overflow-x-auto">
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
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
              disabled={!selectedTime || !selectedCombo}
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
// doctor.profilePicture ||
export default BookingModal;
