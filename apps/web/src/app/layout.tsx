import type { Metadata } from "next";
import type { ReactNode } from "react";
import TopMenu from "@/components/top-menu/TopMenu";
import NavigationMenu from "@/components/navigation-menu/NavigationMenu";
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
        <TopMenu />
        <div className="app-layout__body d-flex flex-column flex-md-row flex-grow-1">
          <NavigationMenu />
          <div className="app-layout__content flex-grow-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
