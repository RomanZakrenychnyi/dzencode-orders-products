import type { Metadata } from "next";
import type { ReactNode } from "react";
import AuthShell from "@/components/auth/AuthShell";
import StoreProvider from "@/store/StoreProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/globals.scss";

export const metadata: Metadata = {
  title: "Orders & Products",
  description: "Приложение учёта приходов и товаров",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body className="app-layout d-flex flex-column min-vh-100">
        <StoreProvider>
        <AuthShell>{children}</AuthShell>
        </StoreProvider>
      </body>
    </html>
  );
}
