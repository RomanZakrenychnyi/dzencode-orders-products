import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Order, Product } from "@/types/inventory";

export interface AuthUser { id: number; email: string; name: string }
const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
  timeout: 10000,
  credentials: "include",
});

export const inventoryApi = createApi({
  reducerPath: "inventoryApi",
  tagTypes: ["Inventory"],
  baseQuery: async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions);
    if (result.error?.status === 401 && typeof window !== "undefined" && window.location.pathname !== "/login") {
      window.location.replace("/login");
    }
    return result;
  },
  endpoints: (builder) => ({
    getMe: builder.query<AuthUser, void>({ query: () => "/auth/me" }),
    login: builder.mutation<AuthUser, { email: string; password: string }>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    logout: builder.mutation<void, void>({ query: () => ({ url: "/auth/logout", method: "POST" }) }),
    getOrders: builder.query<Order[], void>({ query: () => "/orders", providesTags: ["Inventory"] }),
    getProducts: builder.query<Product[], void>({ query: () => "/products", providesTags: ["Inventory"] }),
    deleteOrder: builder.mutation<void, number>({
      query: (id) => ({ url: `/orders/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, error) => error ? [] : ["Inventory"],
    }),
  }),
});

export const { useGetOrdersQuery, useGetProductsQuery, useDeleteOrderMutation } = inventoryApi;
export const { useGetMeQuery, useLoginMutation, useLogoutMutation } = inventoryApi;
