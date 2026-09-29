import type { Metadata } from "next";
import ProductsView from "@/components/products-list/ProductsView";

export const metadata: Metadata = {
  title: "Продукты | Orders & Products",
};

export default function ProductsPage() {
  return <ProductsView />;
}
