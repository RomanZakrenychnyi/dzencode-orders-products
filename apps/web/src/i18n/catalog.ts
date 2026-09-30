import type { Locale } from "./messages";

// Переводы демонстрационных записей. Неизвестные названия показываем как в API.
const ukrainianTitles: Record<string, string> = {
  "Поставка мониторов для рабочего пространства": "Постачання моніторів для робочого простору",
  "Комплектующие для отдела разработки": "Комплектувальні для відділу розробки",
  "Дополнительное оборудование для переговорной и новых рабочих мест": "Додаткове обладнання для переговорної та нових робочих місць",
  "Плановая поставка периферии": "Планове постачання периферії",
  "Монитор Dell P2425H": "Монітор Dell P2425H",
  "Монитор LG 27UP650": "Монітор LG 27UP650",
  "Накопитель Samsung 990 PRO": "Накопичувач Samsung 990 PRO",
  "Клавиатура Logitech K120": "Клавіатура Logitech K120",
  "Монитор Dell P2419H": "Монітор Dell P2419H",
};

export function catalogTitle(title: string, locale: Locale) {
  return locale === "uk" && Object.hasOwn(ukrainianTitles, title) ? ukrainianTitles[title] : title;
}
