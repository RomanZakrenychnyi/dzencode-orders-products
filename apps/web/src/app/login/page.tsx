import { getServerLocale } from "@/i18n/server";
import { messages } from "@/i18n/messages";
import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return { title: `${messages[locale].login.title} | Orders & Products` };
}
export default function LoginPage() { return <LoginForm />; }
