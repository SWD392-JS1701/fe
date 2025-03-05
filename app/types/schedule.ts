export interface ScheduleSlot {
  id: string;
  time: string;
  doctorId: string | null;
  doctorName?: string | null;
  specialization?: string | null;
  status?: string; // Add status
}

export interface Schedule {
  id: string;
  date: string;
  dayOfWeek: string;
  slots?: ScheduleSlot[];
}
