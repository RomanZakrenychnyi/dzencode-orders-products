import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Order, Product } from "@/types/inventory";

export const inventoryApi = createApi({
  reducerPath: "inventoryApi",
  tagTypes: ["Inventory"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
    timeout: 10000,
  }),
  endpoints: (builder) => ({
    getOrders: builder.query<Order[], void>({ query: () => "/orders", providesTags: ["Inventory"] }),
    getProducts: builder.query<Product[], void>({ query: () => "/products", providesTags: ["Inventory"] }),
    deleteOrder: builder.mutation<void, number>({
      query: (id) => ({ url: `/orders/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, error) => error ? [] : ["Inventory"],
    }),
  }),
});

export const { useGetOrdersQuery, useGetProductsQuery, useDeleteOrderMutation } = inventoryApi;
