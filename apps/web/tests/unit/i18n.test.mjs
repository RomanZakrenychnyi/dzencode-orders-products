import assert from "node:assert/strict";
import { test } from "node:test";
import { catalogTitle } from "../../src/i18n/catalog.ts";
import { productTypeLabel } from "../../src/i18n/productTypes.ts";
import { isLocale } from "../../src/i18n/messages.ts";

test("Название прихода и товара переводится на украинский, исходное русское сохраняется", () => {
  const title = "Поставка мониторов для рабочего пространства";
  assert.equal(catalogTitle(title, "uk"), "Постачання моніторів для робочого простору");
  assert.equal(catalogTitle(title, "ru"), title);
  assert.equal(catalogTitle("Монитор Dell P2425H", "uk"), "Монітор Dell P2425H");
});

test("Неизвестные названия отображаются как в API, включая совпадения с ключами Object", () => {
  for (const title of ["Новая поставка", "constructor", "toString", "__proto__", ""]) {
    assert.equal(catalogTitle(title, "uk"), title);
    assert.equal(catalogTitle(title, "ru"), title);
  }
});

test("Перевод типа меняет подпись, неизвестный тип сохраняется", () => {
  assert.equal(productTypeLabel("Мониторы", "uk"), "Монітори");
  assert.equal(productTypeLabel("Мониторы", "ru"), "Мониторы");
  assert.equal(productTypeLabel("Новый тип", "uk"), "Новый тип");
});

test("Из хранилища принимаются только поддерживаемые коды языков", () => {
  assert.equal(isLocale("ru"), true);
  assert.equal(isLocale("uk"), true);
  for (const value of ["en", "ua", "UK", "", null, undefined, 1, {}, ["uk"]]) {
    assert.equal(isLocale(value), false);
  }
});
