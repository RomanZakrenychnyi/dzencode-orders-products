import Link from "next/link";
import HeaderClock from "./HeaderClock";
import SessionCounter from "./SessionCounter";
import LogoutButton from "@/components/auth/LogoutButton";

export default function TopMenu() {
  return (
    <header className="top-menu">
      <div className="top-menu__inner container-fluid d-flex align-items-center flex-wrap">
        <Link href="/" className="top-menu__brand d-inline-flex align-items-center text-decoration-none" aria-label="Inventory — главная">
          <svg className="top-menu__logo" viewBox="0 0 40 48" fill="none" aria-hidden="true">
            <path d="M20 2 37 8v17c0 10-8 17-17 21C11 42 3 35 3 25V8L20 2Z" fill="#85b83e" />
            <path d="m20 8 11 4v13c0 7-5 12-11 15V8Z" fill="#679c2c" />
            <circle cx="20" cy="21" r="9" fill="#a9cbd1" />
            <circle cx="20" cy="18" r="4" fill="white" />
            <path d="M13 28a7 7 0 0 1 14 0 10 10 0 0 1-14 0Z" fill="white" />
          </svg>
          <span>Inventory</span>
        </Link>

        <div className="top-menu__search">
          <label htmlFor="inventory-search" className="visually-hidden">Поиск по приложению</label>
          <input id="inventory-search" type="search" className="top-menu__search-input form-control form-control-sm" placeholder="Поиск" />
        </div>

        <HeaderClock />
        <SessionCounter />
        <LogoutButton />
      </div>
    </header>
  );
}
