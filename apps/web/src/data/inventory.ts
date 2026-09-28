import type { Order, Product } from "@/types/inventory";

export const orders: Order[] = [
  { id: 1, title: "Поставка мониторов для рабочего пространства", date: "2026-09-28T09:00:00Z", description: "Оборудование для рабочих мест" },
  { id: 2, title: "Комплектующие для отдела разработки", date: "2026-09-21T09:00:00Z", description: "Обновление компьютеров" },
  { id: 3, title: "Дополнительное оборудование для переговорной и новых рабочих мест", date: "2026-08-15T09:00:00Z", description: "Расширение офиса" },
  { id: 4, title: "Плановая поставка периферии", date: "2026-07-06T09:00:00Z", description: "Товары пока не добавлены" },
];

export const products: Product[] = [
  {
    id: 1, orderId: 1, title: "Монитор Dell P2425H", serialNumber: "DL-24001",
    isNew: true, photo: null, type: "Мониторы", specification: "24 дюйма, Full HD",
    guarantee: { start: "2026-09-28", end: "2029-09-28" },
    price: [{ amountMinor: 25000, currency: "USD", isDefault: false }, { amountMinor: 1050000, currency: "UAH", isDefault: true }],
    date: "2026-09-28T09:00:00Z",
  },
  {
    id: 2, orderId: 1, title: "Монитор LG 27UP650", serialNumber: "LG-27002",
    isNew: true, photo: null, type: "Мониторы", specification: "27 дюймов, 4K",
    guarantee: { start: "2026-09-28", end: "2028-09-28" },
    price: [{ amountMinor: 32999, currency: "USD", isDefault: false }, { amountMinor: 1399950, currency: "UAH", isDefault: true }],
    date: "2026-09-28T09:00:00Z",
  },
  {
    id: 3, orderId: 2, title: "Накопитель Samsung 990 PRO", serialNumber: "SSD-10003",
    isNew: true, photo: null, type: "Накопители", specification: "SSD, 1 ТБ",
    guarantee: { start: "2026-09-21", end: "2029-09-21" },
    price: [{ amountMinor: 12050, currency: "USD", isDefault: false }, { amountMinor: 510025, currency: "UAH", isDefault: true }],
    date: "2026-09-21T09:00:00Z",
  },
  {
    id: 4, orderId: 3, title: "Клавиатура Logitech K120", serialNumber: "KB-00004",
    isNew: true, photo: null, type: "Клавиатуры", specification: "Проводная, USB",
    guarantee: { start: "2026-08-15", end: "2028-08-15" },
    price: [{ amountMinor: 1590, currency: "USD", isDefault: false }, { amountMinor: 67500, currency: "UAH", isDefault: true }],
    date: "2026-08-15T09:00:00Z",
  },
  {
    id: 5, orderId: 3, title: "Монитор Dell P2419H", serialNumber: "DL-24005",
    isNew: false, photo: null, type: "Мониторы", specification: "24 дюйма, Full HD",
    guarantee: { start: "2026-08-15", end: "2027-08-15" },
    price: [{ amountMinor: 10000, currency: "USD", isDefault: false }, { amountMinor: 420000, currency: "UAH", isDefault: true }],
    date: "2026-08-15T09:00:00Z",
  },
];
