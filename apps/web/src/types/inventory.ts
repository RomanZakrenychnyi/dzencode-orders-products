export type Currency = "USD" | "UAH";

export interface ProductPrice {
  // Целое число центов или копеек, чтобы точно складывать денежные значения.
  amountMinor: number;
  currency: Currency;
  isDefault: boolean;
}

export interface Order {
  id: number;
  title: string;
  date: string;
  description: string;
}

export interface Product {
  id: number;
  orderId: Order["id"];
  title: string;
  serialNumber: string;
  isNew: boolean;
  photo: string | null;
  type: string;
  specification: string;
  guarantee: { start: string; end: string };
  price: ProductPrice[];
  date: string;
}
