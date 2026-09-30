import { getServerLocale } from "@/i18n/server";
import { interfaceMessages } from "@/i18n/interfaceMessages";
import type { Metadata } from "next";
import ProductsView from "@/components/products-list/ProductsView";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return { title: `${interfaceMessages[locale].products} | Orders & Products` };
}

export default function ProductsPage() {
  return <ProductsView />;
}
