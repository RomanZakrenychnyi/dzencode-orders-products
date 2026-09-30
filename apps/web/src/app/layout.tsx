import { getServerLocale } from "@/i18n/server";
import { interfaceMessages } from "@/i18n/interfaceMessages";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import AuthShell from "@/components/auth/AuthShell";
import StoreProvider from "@/store/StoreProvider";
import LocaleProvider from "@/i18n/LocaleProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/globals.scss";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return { title: "Orders & Products", description: interfaceMessages[locale].description };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getServerLocale();
  return (
    <html lang={locale}>
      <body className="app-layout d-flex flex-column min-vh-100">
        <LocaleProvider initialLocale={locale}><StoreProvider>
        <AuthShell>{children}</AuthShell>
        </StoreProvider></LocaleProvider>
      </body>
    </html>
  );
}
