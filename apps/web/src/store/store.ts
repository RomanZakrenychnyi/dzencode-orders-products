import { configureStore } from "@reduxjs/toolkit";
import inventoryReducer from "./inventorySlice";

export const makeStore = () => configureStore({
  reducer: { inventory: inventoryReducer },
});

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
