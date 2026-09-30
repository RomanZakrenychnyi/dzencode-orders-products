import type { Locale } from "./messages";

// Значение из API остаётся ключом фильтра; перевод меняет только подпись.
const labels: Record<string, { ru: string; uk: string }> = {
  "Мониторы": { ru: "Мониторы", uk: "Монітори" },
  "Накопители": { ru: "Накопители", uk: "Накопичувачі" },
  "Клавиатуры": { ru: "Клавиатуры", uk: "Клавіатури" },
};

export function productTypeLabel(type: string, locale: Locale) {
  return labels[type]?.[locale] ?? type;
}
