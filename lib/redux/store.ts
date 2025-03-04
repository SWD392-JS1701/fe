import { configureStore, createSlice } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";

// create slice to organize sign-in state
interface AuthState {
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  isAuthenticated:
    typeof window !== "undefined" && !!localStorage.getItem("access_token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state) {
      state.isAuthenticated = true;
    },
    logout(state) {
      state.isAuthenticated = false;
      localStorage.removeItem("access_token");
    },
  },
});

export const { login, logout } = authSlice.actions;

// Cấu hình Redux store
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authSlice.reducer, // Thêm auth vào reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
