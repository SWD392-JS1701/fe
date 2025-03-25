export interface Booking {
  _id?: string;
  booking_id?: string;
  user_id: string;
  doctor_id: string;
  combo_id: string;
  booking_time: Date | string;
  booking_date?: string;
  dayofweek?: string;
  status?: string;
  scheduleId: string;
  slotId: string;
  createdAt?: string;
  updatedAt?: string;
  type?: string;
  description?: string;
  __v?: number;
}

export interface CreateBookingRequest {
  booking_id?: string;
  user_id: string;
  doctor_id: string;
  combo_id: string;
  booking_time: Date;
  booking_date: string;
  dayofweek: string;
  status?: string;
  scheduleId: string;
  slotId: string;
}

export interface UpdateBookingRequest {
  booking_id?: string;
  user_id?: string;
  doctor_id?: string;
  combo_id?: string;
  booking_time?: Date;
  booking_date?: string;
  dayofweek?: string;
  status?: string;
  scheduleId?: string;
  slotId?: string;
}
