import { useGetOrdersQuery, useGetProductsQuery } from "./inventoryApi";

import { useLocale } from "@/i18n/LocaleProvider";
import { catalogTitle } from "@/i18n/catalog";

export function useInventory() {
  const { locale } = useLocale();
  const ordersQuery = useGetOrdersQuery();
  const productsQuery = useGetProductsQuery();
  return {
    orders: (ordersQuery.data ?? []).map(order => ({ ...order, title: catalogTitle(order.title, locale) })),
    products: (productsQuery.data ?? []).map(product => ({ ...product, title: catalogTitle(product.title, locale) })),
    isLoading: (!ordersQuery.data && (ordersQuery.isLoading || ordersQuery.isFetching))
      || (!productsQuery.data && (productsQuery.isLoading || productsQuery.isFetching)),
    isFetching: ordersQuery.isFetching || productsQuery.isFetching,
    isError: ordersQuery.isError || productsQuery.isError,
    retry: () => { void ordersQuery.refetch(); void productsQuery.refetch(); },
  };
}
