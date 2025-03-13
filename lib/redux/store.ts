import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";

interface User {
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
  isAuthenticated:
    typeof window !== "undefined" && !!localStorage.getItem("access_token"),
  user: null,
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
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
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
