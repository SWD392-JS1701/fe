export interface ScheduleSlot {
  _id: string;
  slotId?: string;
  startTime: string;
  endTime: string;
  doctorId: string | null;
  doctorName?: string | null;
  specialization?: string | null;
  status?: string;
  dayOfWeek: string;
  scheduleId?: string;
}

export interface Schedule {
  id: string;
  date: string;
  dayOfWeek: string;
  slots?: ScheduleSlot[];
}

export interface UpdateSchedule {
  date: string;
  dayOfWeek: string;
  slots?: ScheduleSlot[];
}
