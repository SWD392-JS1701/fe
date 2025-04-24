import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import bookingReducer from "./bookingSlice";

export interface User {
  id: string;
  username?: string;
  role?: string;
  access_token?: string;
}

// create slice to organize sign-in state
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
});

export const { login, logout, setUser } = authSlice.actions;

// Cấu hình Redux store
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authSlice.reducer,
    booking: bookingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
