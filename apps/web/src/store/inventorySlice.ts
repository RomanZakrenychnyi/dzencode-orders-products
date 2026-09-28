import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { orders, products } from "../data/inventory";
import type { Order, Product } from "../types/inventory";

interface InventoryState {
  orders: Order[];
  products: Product[];
}

const initialState: InventoryState = { orders, products };

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    orderDeleted(state, action: PayloadAction<number>) {
      state.orders = state.orders.filter((order) => order.id !== action.payload);
      state.products = state.products.filter((product) => product.orderId !== action.payload);
    },
  },
});

export const { orderDeleted } = inventorySlice.actions;
export default inventorySlice.reducer;
