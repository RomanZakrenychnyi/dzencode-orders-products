"use client";

import { useRef, type ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "./store";
import { inventoryApi } from "./inventoryApi";
import type { InventorySnapshot } from "@/types/inventorySnapshot";

export default function StoreProvider({ children, initialData }: { children: ReactNode; initialData?: InventorySnapshot }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    const store = makeStore();
    if (initialData) {
      // Синхронное заполнение до первого рендера: сервер и браузер видят одинаковые данные.
      store.dispatch(inventoryApi.util.upsertQueryEntries([
        { endpointName: "getMe", arg: undefined, value: initialData.user },
        { endpointName: "getOrders", arg: undefined, value: initialData.orders },
        { endpointName: "getProducts", arg: undefined, value: initialData.products },
      ]));
    }
    storeRef.current = store;
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
