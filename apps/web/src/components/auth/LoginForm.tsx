"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLoginMutation } from "@/store/inventoryApi";

const schema = z.object({
  email: z.email("Введите корректный email").max(254, "Email слишком длинный"),
  password: z.string().min(8, "Минимум 8 символов").max(128, "Максимум 128 символов"),
});
type LoginFields = z.infer<typeof schema>;

export default function LoginForm() {
  const [login] = useLoginMutation();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<LoginFields>({
    resolver: zodResolver(schema), defaultValues: { email: "", password: "" },
  });
  return (
    <main className="login-page d-flex align-items-center justify-content-center flex-grow-1 p-3">
      <section className="login-page__card card border-0 shadow-sm p-4 p-sm-5" aria-labelledby="login-title">
        <p className="login-page__brand fw-semibold mb-3">INVENTORY</p>
        <h1 id="login-title" className="h3 mb-2">Вход в аккаунт</h1>
        <p className="text-secondary mb-4">Войдите, чтобы работать с приходами и товарами.</p>
        <form noValidate onSubmit={handleSubmit(async (values) => {
          try { await login(values).unwrap(); window.location.replace("/orders"); }
          catch (error) {
            const status = (error as { status?: number | string }).status;
            setError("root", { message: status === 401 ? "Неверный email или пароль" : status === 429
              ? "Слишком много попыток. Попробуйте через 15 минут" : "Не удалось войти. Попробуйте ещё раз." });
          }
        })}>
          <div className="mb-3">
            <label htmlFor="login-email" className="form-label">Email</label>
            <input id="login-email" type="email" autoComplete="username" className={`form-control${errors.email ? " is-invalid" : ""}`}
              aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} {...register("email")} />
            {errors.email && <div id="email-error" className="invalid-feedback">{errors.email.message}</div>}
          </div>
          <div className="mb-4">
            <label htmlFor="login-password" className="form-label">Пароль</label>
            <input id="login-password" type="password" autoComplete="current-password" className={`form-control${errors.password ? " is-invalid" : ""}`}
              aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "password-error" : undefined} {...register("password")} />
            {errors.password && <div id="password-error" className="invalid-feedback">{errors.password.message}</div>}
          </div>
          {errors.root && <p className="alert alert-danger" role="alert">{errors.root.message}</p>}
          <button className="login-page__submit btn w-100" disabled={isSubmitting} type="submit">{isSubmitting ? "Входим…" : "Войти"}</button>
        </form>
      </section>
    </main>
  );
}
