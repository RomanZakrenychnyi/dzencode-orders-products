import type { AuthUser } from "@/store/inventoryApi";
import type { Order, Product } from "./inventory";

export interface InventorySnapshot {
  user: AuthUser;
  orders: Order[];
  products: Product[];
}
