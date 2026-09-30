export const messages = {
  ru: {
    language: "Язык интерфейса",
    login: {
      title: "Вход в аккаунт", description: "Войдите, чтобы работать с приходами и товарами.",
      email: "Email", password: "Пароль", submit: "Войти", submitting: "Входим…",
      errors: {
        emailInvalid: "Введите корректный email", emailLong: "Email слишком длинный",
        passwordShort: "Минимум 8 символов", passwordLong: "Максимум 128 символов",
        credentials: "Неверный email или пароль",
        rateLimit: "Слишком много попыток. Попробуйте через 15 минут",
        unavailable: "Не удалось войти. Попробуйте ещё раз.",
      },
    },
  },
  uk: {
    language: "Мова інтерфейсу",
    login: {
      title: "Вхід в обліковий запис", description: "Увійдіть, щоб працювати з надходженнями та товарами.",
      email: "Email", password: "Пароль", submit: "Увійти", submitting: "Входимо…",
      errors: {
        emailInvalid: "Введіть коректний email", emailLong: "Email задовгий",
        passwordShort: "Щонайменше 8 символів", passwordLong: "Щонайбільше 128 символів",
        credentials: "Неправильний email або пароль",
        rateLimit: "Забагато спроб. Спробуйте через 15 хвилин",
        unavailable: "Не вдалося увійти. Спробуйте ще раз.",
      },
    },
  },
};

export type Locale = keyof typeof messages;
export function isLocale(value: unknown): value is Locale { return value === "ru" || value === "uk"; }
