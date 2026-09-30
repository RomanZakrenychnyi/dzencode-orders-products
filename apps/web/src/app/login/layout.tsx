import type { ReactNode } from "react";
import StoreProvider from "@/store/StoreProvider";

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <StoreProvider>{children}</StoreProvider>;
}
