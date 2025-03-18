export interface ScheduleSlot {
  id: string;
  startTime: string;
  endTime: string;
  doctorId: string | null;
  doctorName?: string | null;
  specialization?: string | null;
  status?: string;
  dayOfWeek: string;
}

export interface Schedule {
  id: string;
  date: string;
  dayOfWeek: string;
  slots?: ScheduleSlot[];
}
