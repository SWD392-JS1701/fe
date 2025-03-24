"use client";

import React, { FC, useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { createBookingController, findBookingsByUserIdController } from "@/app/controller/bookingController";
import { format, isBefore, parse, startOfToday, isToday, addDays } from "date-fns";
import { useRouter } from "next/navigation";
import { updateExistingSlot } from "@/app/controller/scheduleController";
import { useDispatch } from "react-redux";
import { incrementBookingCount } from "@/lib/redux/bookingSlice";

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
  const { data: session } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();
  const [slots, setSlots] = useState<ScheduleSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("Monday");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<ScheduleSlot | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const [bookingType, setBookingType] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // Helper function to convert 12-hour format to 24-hour format
  const convertTo24Hour = (time12h: string) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = String(parseInt(hours, 10) + 12);
    }

    return `${hours.padStart(2, '0')}:${minutes}`;
  };

  // Helper function to check if a slot is in the past or within 2 hours from now
  const isSlotUnavailable = useCallback((slotDate: Date, startTime: string) => {
    const now = new Date();
    // Convert the slot time from 12-hour to 24-hour format
    const time24h = convertTo24Hour(startTime);
    const [hours, minutes] = time24h.split(':').map(Number);
    
    const slotDateTime = new Date(slotDate);
    slotDateTime.setHours(hours, minutes, 0, 0);

    // Add 2 hours buffer to current time
    const bufferTime = new Date(now.getTime() + (2 * 60 * 60 * 1000));
    
    return isBefore(slotDateTime, bufferTime);
  }, []);

  useEffect(() => {
    // Get dates for the next 7 days starting from today
    const today = new Date();
    const dates = Array.from({ length: 7 }, (_, i) => addDays(today, i));
    setWeekDates(dates);
    // Set the initial selected date to today's day name
    setSelectedDate(format(today, 'EEEE'));
  }, []);

  // Fetch slots and check availability
  useEffect(() => {
    if (isOpen && doctor?._id) {
      const fetchData = async () => {
        setLoadingSlots(true);
        try {
          const scheduleData = await fetchScheduleSlotsByDoctorId(doctor._id);
          console.log("scheduleData", scheduleData);
          setSlots(scheduleData);
        } catch (error) {
          console.error("Failed to fetch data:", error);
          toast.error("Failed to load schedule");
        } finally {
          setLoadingSlots(false);
        }
      };
      fetchData();

      // Set up interval to check availability
      const availabilityCheck = setInterval(() => {
        // Force a re-render to update slot availability
        setSlots(prevSlots => [...prevSlots]);
      }, 60000); // Check every minute

      return () => clearInterval(availabilityCheck);
    }
  }, [isOpen, doctor?._id]);

  // Check if selected slot is still available
  useEffect(() => {
    if (selectedTime && selectedSlot && selectedDate) {
      const slotDate = weekDates[weekDates.findIndex(date => 
        format(date, 'EEEE') === selectedDate
      )];
      
      if (slotDate && isSlotUnavailable(slotDate, selectedTime)) {
        setSelectedTime(null);
        setSelectedSlot(null);
        toast.error("Selected time slot is no longer available");
      }
    }
  }, [selectedTime, selectedSlot, selectedDate, weekDates, isSlotUnavailable]);

  const getDaySlots = useCallback((dayOfWeek: string) => {
    const dayIndex = weekDates.findIndex(date => format(date, 'EEEE') === dayOfWeek);
    const currentDate = weekDates[dayIndex];

    return slots.filter((slot) => {
      if (slot.doctorId !== doctor?._id || slot.dayOfWeek !== dayOfWeek) {
        return false;
      }

      // Check if slot is booked
      if (slot.status === "booked") {
        return true; // Still show booked slots
      }

      // Check if slot is within 2 hours
      if (currentDate && isSlotUnavailable(currentDate, slot.startTime)) {
        return true; // Still show unavailable slots
      }

      return true;
    });
  }, [slots, weekDates, doctor?._id, isSlotUnavailable]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string, slot: ScheduleSlot) => {
    setSelectedTime(time);
    setSelectedSlot(slot);
  };

  const handleConfirm = async () => {
    if (!selectedTime || !selectedSlot || !session?.user?.id || !bookingType) {
      toast.error("Please select a time slot and booking type to continue");
      return;
    }

    try {
      setIsBooking(true);
      // Get the selected date from weekDates
      const selectedSlotDate = weekDates[weekDates.findIndex(date => 
        format(date, 'EEEE') === selectedDate
      )];
      
      if (!selectedSlotDate) {
        throw new Error("Invalid date selected");
      }

      // Create the booking with the correct selected date
      const bookingTime = new Date(
        selectedSlotDate.getFullYear(),
        selectedSlotDate.getMonth(),
        selectedSlotDate.getDate(),
        ...convertTo24Hour(selectedSlot.startTime).split(':').map(Number)
      );

      if (!selectedSlot.scheduleId || !selectedSlot.slotId) {
        throw new Error("Invalid slot data: missing schedule or slot ID");
      }

      const bookingData = {
        user_id: session.user.id,
        doctor_id: doctor._id,
        combo_id: "default",
        booking_time: bookingTime,
        booking_date: format(bookingTime, 'yyyy-MM-dd'),
        dayofweek: selectedDate,
        status: "Pending",
        scheduleId: selectedSlot.scheduleId,
        slotId: selectedSlot.slotId,
        type: bookingType,
        description: description.trim() || undefined
      };

      // Create the booking
      await createBookingController(bookingData);
      
      // Update the slot status to booked
      if (selectedSlot._id && selectedSlot.scheduleId) {
        const updateData = {
          status: "booked",
          doctorId: selectedSlot.doctorId,
          doctorName: selectedSlot.doctorName,
          specialization: selectedSlot.specialization
        };
        
        await updateExistingSlot(
          selectedSlot.scheduleId,
          selectedSlot.slotId || selectedSlot._id,
          updateData
        );
      }
      
      // Increment the booking count in Redux
      dispatch(incrementBookingCount());
      
      toast.success("Booking created successfully!");
      setShowInstructions(true);
      onClose();
      
      // Redirect to my-bookings page
      router.push('/my-bookings');
    } catch (error: any) {
      toast.error(error.message || "Failed to create booking");
    } finally {
      setIsBooking(false);
    }
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
              {weekDates.map((date, index) => {
                const dayName = format(date, 'EEEE');
                // Show days that have any slots
                if (!slots.some(slot => slot.dayOfWeek === dayName)) {
                  return null;
                }
                const isToday = index === 0;

                return (
                  <button
                    key={dayName}
                    className={`px-3 py-2 rounded-md text-sm ${
                      selectedDate === dayName
                        ? "bg-blue-500 text-white"
                        : isToday
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    } whitespace-nowrap flex flex-col items-center`}
                    onClick={() => handleDateSelect(dayName)}
                  >
                    <span>{dayName}</span>
                    <span className="text-xs mt-1">
                      {format(date, 'MMM dd')}
                      {isToday && " (Today)"}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {loadingSlots ? (
                <p>Loading slots...</p>
              ) : (
                getDaySlots(selectedDate).map((slot) => {
                  const slotDate = weekDates[weekDates.findIndex(date => 
                    format(date, 'EEEE') === selectedDate
                  )];
                  const isUnavailable = slotDate && (
                    slot.status === "booked" || 
                    isSlotUnavailable(slotDate, slot.startTime)
                  );
                  
                  return (
                    <button
                      key={slot._id}
                      className={`px-3 py-2 rounded-md text-sm ${
                        selectedTime === slot.startTime
                          ? "bg-green-500 text-white"
                          : isUnavailable
                          ? "bg-gray-300 text-gray-500"
                          : "bg-green-200 text-green-800 hover:bg-green-300"
                      }`}
                      disabled={isUnavailable}
                      onClick={() => handleTimeSelect(slot.startTime, slot)}
                    >
                      <div className="flex flex-col items-center">
                        <span>{`${slot.startTime} - ${slot.endTime}`}</span>
                        <span className="text-xs mt-1">
                          {format(slotDate, 'MMM dd')}
                        </span>
                        <span className="text-xs">
                          {slot.status === "booked" 
                            ? "(Booked)" 
                            : isUnavailable
                            ? "(Unavailable)"
                            : "(Available)"}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            <p className="text-xs text-gray-500 mt-2 flex justify-center gap-2">
              <span className="bg-green-500 text-white px-2 py-1 rounded">
                Selected
              </span>
              <span className="bg-gray-300 text-gray-500 px-2 py-1 rounded">
                Unavailable
              </span>
              <span className="bg-green-200 text-green-800 px-2 py-1 rounded">
                Available
              </span>
            </p>
          </div>

          {/* Booking Type and Description */}
          {selectedTime && (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type of Counselling*
                </label>
                <select
                  value={bookingType}
                  onChange={(e) => setBookingType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a type</option>
                  <option value="Regular Checkup">Regular Checkup</option>
                  <option value="Skin Consultation">Skin Consultation</option>
                  <option value="Treatment Follow-up">Treatment Follow-up</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message for Doctor (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your concerns or any specific requirements..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <button
              onClick={onClose}
              className="flex items-center px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors duration-200 font-medium"
              disabled={isBooking}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedTime || !bookingType || isBooking}
              className={`px-4 py-2 rounded-md transition-all duration-200 ${
                selectedTime && bookingType && !isBooking
                  ? 'bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-md hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isBooking ? 'Creating Booking...' : selectedTime ? 'Continue Booking' : 'Select a Time Slot'}
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
