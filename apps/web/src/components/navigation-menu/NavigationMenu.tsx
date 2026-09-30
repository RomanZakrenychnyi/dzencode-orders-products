"use client";

import { useLocale } from "@/i18n/LocaleProvider";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavigationMenu() {
  const { ui } = useLocale();
  const pathname = usePathname();
  const menuItems = [
    { label: ui.order, href: "/orders" },
    { label: ui.groups, href: null },
    { label: ui.products, href: "/products" },
    { label: ui.users, href: null },
    { label: ui.settings, href: null },
  ];



  return (
    <aside className="navigation-menu d-flex flex-column align-items-center">
      <div className="navigation-menu__profile">
        <div className="navigation-menu__avatar" role="img" aria-label={ui.avatar}>
          <svg viewBox="0 0 96 96" fill="none" aria-hidden="true">
            <circle cx="48" cy="48" r="48" fill="#dce6e9" />
            <circle cx="48" cy="35" r="17" fill="#91a7af" />
            <path d="M15 91v-9a33 33 0 0 1 66 0v9" fill="#91a7af" />
          </svg>
        </div>
        <span className="navigation-menu__settings" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="m10 3-.6 2.2-1.6.9-2.2-.6-2 3.5 1.6 1.6v1.8L3.6 14l2 3.5 2.2-.6 1.6.9.6 2.2h4l.6-2.2 1.6-.9 2.2.6 2-3.5-1.6-1.6v-1.8L20.4 9l-2-3.5-2.2.6-1.6-.9L14 3h-4Z" fill="currentColor" />
            <circle cx="12" cy="11.5" r="3" fill="white" />
          </svg>
        </span>
      </div>

      <nav className="navigation-menu__nav w-100" aria-label={ui.navigation}>
        <ul className="nav flex-row flex-md-column justify-content-center align-items-center gap-3">
          {menuItems.map(({ label, href }) => (
            <li key={label} className="nav-item">
              {href ? (
                <Link
                  href={href}
                  className={`navigation-menu__item${pathname === href ? " navigation-menu__item--active" : ""}`}
                  aria-current={pathname === href ? "page" : undefined}
                >
                  {label}
                </Link>
              ) : (
                <span className="navigation-menu__item navigation-menu__item--disabled" aria-disabled="true">
                  {label}
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
