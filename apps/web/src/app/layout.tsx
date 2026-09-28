import type { Metadata } from "next";
import type { ReactNode } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/globals.scss";

export const metadata: Metadata = {
  title: "Orders & Products",
  description: "Приложение учёта приходов и товаров",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
