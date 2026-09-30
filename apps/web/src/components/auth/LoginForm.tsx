"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLoginMutation } from "@/store/inventoryApi";
import { useEffect } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const schema = z.object({
  email: z.email("emailInvalid").max(254, "emailLong"),
  password: z.string().min(8, "passwordShort").max(128, "passwordLong"),
});
type LoginFields = z.infer<typeof schema>;

export default function LoginForm() {
  const { messages } = useLocale();
  const t = messages.login;
  useEffect(() => { document.title = `${t.title} | Orders & Products`; }, [t.title]);
  const errorText = (key?: string) => key && key in t.errors ? t.errors[key as keyof typeof t.errors] : t.errors.unavailable;
  const [login] = useLoginMutation();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<LoginFields>({
    resolver: zodResolver(schema), defaultValues: { email: "", password: "" },
  });
  return (
    <main className="login-page d-flex align-items-center justify-content-center flex-grow-1 p-3">
      <section className="login-page__card card border-0 shadow-sm p-4 p-sm-5" aria-labelledby="login-title">
        <div className="d-flex justify-content-between align-items-center gap-3 mb-4">
          <p className="login-page__brand fw-semibold mb-0">INVENTORY</p>
          <LanguageSwitcher />
        </div>
        <h1 id="login-title" className="h3 mb-2">{t.title}</h1>
        <p className="text-secondary mb-4">{t.description}</p>
        <form noValidate onSubmit={handleSubmit(async (values) => {
          try { await login(values).unwrap(); window.location.replace("/orders"); }
          catch (error) {
            const status = (error as { status?: number | string }).status;
            setError("root", { message: status === 401 ? "credentials" : status === 429 ? "rateLimit" : "unavailable" });
          }
        })}>
          <div className="mb-3">
            <label htmlFor="login-email" className="form-label">{t.email}</label>
            <input id="login-email" type="email" autoComplete="username" className={`form-control${errors.email ? " is-invalid" : ""}`}
              aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} {...register("email")} />
            {errors.email && <div id="email-error" className="invalid-feedback">{errorText(errors.email.message)}</div>}
          </div>
          <div className="mb-4">
            <label htmlFor="login-password" className="form-label">{t.password}</label>
            <input id="login-password" type="password" autoComplete="current-password" className={`form-control${errors.password ? " is-invalid" : ""}`}
              aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "password-error" : undefined} {...register("password")} />
            {errors.password && <div id="password-error" className="invalid-feedback">{errorText(errors.password.message)}</div>}
          </div>
          {errors.root && <p className="alert alert-danger" role="alert">{errorText(errors.root.message)}</p>}
          <button className="login-page__submit btn w-100" disabled={isSubmitting} type="submit">{isSubmitting ? t.submitting : t.submit}</button>
        </form>
      </section>
    </main>
  );
}
