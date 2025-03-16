export interface Booking {
  _id?: string;
  booking_id?: string;
  user_id: string;
  doctor_id: string;
  combo_id: string;
  booking_time: Date | string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CreateBookingRequest {
  booking_id?: string;
  user_id: string;
  doctor_id: string;
  combo_id: string;
  booking_time: Date;
}

export interface UpdateBookingRequest {
  booking_id?: string;
  user_id?: string;
  doctor_id?: string;
  combo_id?: string;
  booking_time?: Date;
}
