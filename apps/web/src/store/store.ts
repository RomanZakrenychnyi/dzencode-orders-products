import { configureStore } from "@reduxjs/toolkit";
import { inventoryApi } from "./inventoryApi";

export const makeStore = () => configureStore({
  reducer: { [inventoryApi.reducerPath]: inventoryApi.reducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(inventoryApi.middleware),
});

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
