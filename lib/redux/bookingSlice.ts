import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BookingState {
  count: number;
}

const initialState: BookingState = {
  count: 0,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBookingCount: (state, action: PayloadAction<number>) => {
      state.count = action.payload;
    },
    incrementBookingCount: (state) => {
      state.count += 1;
    },
    decrementBookingCount: (state) => {
      state.count = Math.max(0, state.count - 1);
    },
    resetBookingCount: (state) => {
      state.count = 0;
    },
  },
});

export const { setBookingCount, incrementBookingCount, decrementBookingCount, resetBookingCount } = bookingSlice.actions;
export default bookingSlice.reducer; 