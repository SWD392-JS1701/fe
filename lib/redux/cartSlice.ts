import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Swal from "sweetalert2";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add item to cart
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (!existingItem) {
        state.items.push({ ...action.payload, quantity: 1 });
        Swal.fire({
          icon: "success",
          title: "Item added to cart",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        existingItem.quantity += 1;
        Swal.fire({
          icon: "success",
          title: "Item quantity updated",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },

    // Update item quantity
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        Swal.fire({
          icon: "success",
          title: "Quantity updated",
          text: `Quantity for ${item.name} has been updated to ${item.quantity}.`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },

    // Remove item from cart
    removeFromCart: (state, action: PayloadAction<string>) => {
      const removedItem = state.items.find(
        (item) => item.id === action.payload
      );
      if (removedItem) {
        state.items = state.items.filter((item) => item.id !== action.payload);
        Swal.fire({
          icon: "success",
          title: "Item removed from cart",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },

    // Clear the entire cart
    clearCart: (state) => {
      state.items = [];
      Swal.fire({
        icon: "warning",
        title: "Cart cleared",
        text: "Your cart has been cleared.",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
