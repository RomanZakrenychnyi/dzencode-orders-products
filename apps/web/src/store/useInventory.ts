import { useGetOrdersQuery, useGetProductsQuery } from "./inventoryApi";

export function useInventory() {
  const ordersQuery = useGetOrdersQuery();
  const productsQuery = useGetProductsQuery();
  return {
    orders: ordersQuery.data ?? [],
    products: productsQuery.data ?? [],
    isLoading: (!ordersQuery.data && (ordersQuery.isLoading || ordersQuery.isFetching))
      || (!productsQuery.data && (productsQuery.isLoading || productsQuery.isFetching)),
    isFetching: ordersQuery.isFetching || productsQuery.isFetching,
    isError: ordersQuery.isError || productsQuery.isError,
    retry: () => { void ordersQuery.refetch(); void productsQuery.refetch(); },
  };
}
