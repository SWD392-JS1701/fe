export interface Schedule {
  id: string;
  date: string;
  dateOfWeek: string;
  startTime: string;
  endTime: string;
  slots?: any[];
}
