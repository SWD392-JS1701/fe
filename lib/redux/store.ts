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
    login(state, action: PayloadAction<User>) {
      state.isAuthenticated = true;
      state.user = action.payload;
      if (action.payload.access_token) {
        localStorage.setItem("access_token", action.payload.access_token);
      }
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("access_token");
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
  },
});

export const { login, logout, setUser } = authSlice.actions;

// Cấu hình Redux store
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authSlice.reducer, // Thêm auth vào reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
