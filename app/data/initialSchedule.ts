interface ScheduleSlot {
  id: string;
  time: string;
  doctorId: string | null;
}

interface DaySchedule {
  day: string;
  slots: ScheduleSlot[];
}

export const initialSchedule: DaySchedule[] = [
  {
    day: "Monday",
    slots: [
      { id: "slot-001", time: "09:00 AM - 10:00 AM", doctorId: null },
      { id: "slot-002", time: "10:00 AM - 11:00 AM", doctorId: null },
      { id: "slot-003", time: "11:00 AM - 12:00 PM", doctorId: null },
      { id: "slot-004", time: "12:00 PM - 01:00 PM", doctorId: null },
      { id: "slot-005", time: "01:00 PM - 02:00 PM", doctorId: null },
      { id: "slot-006", time: "02:00 PM - 03:00 PM", doctorId: null },
      { id: "slot-007", time: "03:00 PM - 04:00 PM", doctorId: null },
    ],
  },
  {
    day: "Tuesday",
    slots: [
      { id: "slot-001", time: "09:00 AM - 10:00 AM", doctorId: null },
      { id: "slot-002", time: "10:00 AM - 11:00 AM", doctorId: null },
      { id: "slot-003", time: "11:00 AM - 12:00 PM", doctorId: null },
      { id: "slot-004", time: "12:00 PM - 01:00 PM", doctorId: null },
      { id: "slot-005", time: "01:00 PM - 02:00 PM", doctorId: null },
      { id: "slot-006", time: "02:00 PM - 03:00 PM", doctorId: null },
      { id: "slot-007", time: "03:00 PM - 04:00 PM", doctorId: null },
    ],
  },
  {
    day: "Wednesday",
    slots: [
      { id: "slot-001", time: "09:00 AM - 10:00 AM", doctorId: null },
      { id: "slot-002", time: "10:00 AM - 11:00 AM", doctorId: null },
      { id: "slot-003", time: "11:00 AM - 12:00 PM", doctorId: null },
      { id: "slot-004", time: "12:00 PM - 01:00 PM", doctorId: null },
      { id: "slot-005", time: "01:00 PM - 02:00 PM", doctorId: null },
      { id: "slot-006", time: "02:00 PM - 03:00 PM", doctorId: null },
      { id: "slot-007", time: "03:00 PM - 04:00 PM", doctorId: null },
    ],
  },
  {
    day: "Thursday",
    slots: [
      { id: "slot-001", time: "09:00 AM - 10:00 AM", doctorId: null },
      { id: "slot-002", time: "10:00 AM - 11:00 AM", doctorId: null },
      { id: "slot-003", time: "11:00 AM - 12:00 PM", doctorId: null },
      { id: "slot-004", time: "12:00 PM - 01:00 PM", doctorId: null },
      { id: "slot-005", time: "01:00 PM - 02:00 PM", doctorId: null },
      { id: "slot-006", time: "02:00 PM - 03:00 PM", doctorId: null },
      { id: "slot-007", time: "03:00 PM - 04:00 PM", doctorId: null },
    ],
  },
  {
    day: "Friday",
    slots: [
      { id: "slot-001", time: "09:00 AM - 10:00 AM", doctorId: null },
      { id: "slot-002", time: "10:00 AM - 11:00 AM", doctorId: null },
      { id: "slot-003", time: "11:00 AM - 12:00 PM", doctorId: null },
      { id: "slot-004", time: "12:00 PM - 01:00 PM", doctorId: null },
      { id: "slot-005", time: "01:00 PM - 02:00 PM", doctorId: null },
      { id: "slot-006", time: "02:00 PM - 03:00 PM", doctorId: null },
      { id: "slot-007", time: "03:00 PM - 04:00 PM", doctorId: null },
    ],
  },
  {
    day: "Saturday",
    slots: [
      { id: "slot-001", time: "09:00 AM - 10:00 AM", doctorId: null },
      { id: "slot-002", time: "10:00 AM - 11:00 AM", doctorId: null },
      { id: "slot-003", time: "11:00 AM - 12:00 PM", doctorId: null },
      { id: "slot-004", time: "12:00 PM - 01:00 PM", doctorId: null },
      { id: "slot-005", time: "01:00 PM - 02:00 PM", doctorId: null },
      { id: "slot-006", time: "02:00 PM - 03:00 PM", doctorId: null },
      { id: "slot-007", time: "03:00 PM - 04:00 PM", doctorId: null },
    ],
  },
  {
    day: "Sunday",
    slots: [
      { id: "slot-001", time: "09:00 AM - 10:00 AM", doctorId: null },
      { id: "slot-002", time: "10:00 AM - 11:00 AM", doctorId: null },
      { id: "slot-003", time: "11:00 AM - 12:00 PM", doctorId: null },
      { id: "slot-004", time: "12:00 PM - 01:00 PM", doctorId: null },
      { id: "slot-005", time: "01:00 PM - 02:00 PM", doctorId: null },
      { id: "slot-006", time: "02:00 PM - 03:00 PM", doctorId: null },
      { id: "slot-007", time: "03:00 PM - 04:00 PM", doctorId: null },
    ],
  },
];
