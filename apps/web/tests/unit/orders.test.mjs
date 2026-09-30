import assert from "node:assert/strict";
import { test } from "node:test";
import { getOrderSummary, formatMoney, formatOrderDate, productCountLabel } from "../../src/lib/orders.ts";

// Собственные небольшие примеры: тесты не зависят от seed и состояния MySQL.
const price = (currency, amountMinor, isDefault = false) => ({ currency, amountMinor, isDefault });
const product = (id, orderId, prices) => ({
  id, orderId, title: `Product ${id}`, serialNumber: `TEST-${id}`, isNew: true,
  photo: null, type: "Мониторы", specification: "", price: prices,
  guarantee: { start: "2026-09-28", end: "2027-09-28" }, date: "2026-09-28T09:00:00Z",
});

test("Суммы USD и UAH считаются отдельно, чужие товары исключаются", () => {
  const products = [
    product(1, 7, [price("USD", 10025), price("UAH", 40000, true)]),
    product(2, 7, [price("USD", 25050, true), price("UAH", 100000)]),
    product(3, 8, [price("USD", 999999), price("UAH", 999999, true)]),
  ];
  assert.deepEqual(getOrderSummary(7, products), { productCount: 2, totals: { USD: 35075, UAH: 140000 } });
});

test("Пустой список и приход без связанных товаров дают нули", () => {
  const expected = { productCount: 0, totals: { USD: 0, UAH: 0 } };
  assert.deepEqual(getOrderSummary(7, []), expected);
  assert.deepEqual(getOrderSummary(7, [product(1, 8, [price("USD", 100)])]), expected);
});

test("Товар без цены входит в количество, отсутствующая валюта остаётся нулевой", () => {
  assert.deepEqual(getOrderSummary(7, [product(1, 7, []), product(2, 7, [price("UAH", 105025)])]), {
    productCount: 2, totals: { USD: 0, UAH: 105025 },
  });
});

test("Центы складываются точно, без погрешности дробных денежных значений", () => {
  const result = getOrderSummary(7, [product(1, 7, [price("USD", 10)]), product(2, 7, [price("USD", 20)])]);
  assert.equal(result.totals.USD, 30);
  assert.equal(formatMoney(result.totals.USD), "0,30");
});

test("Подсчёт не изменяет исходные товары и цены", () => {
  const products = [product(1, 7, [price("UAH", 100, true)])];
  const before = structuredClone(products);
  getOrderSummary(7, products);
  assert.deepEqual(products, before);
});

for (const locale of ["ru", "uk"]) {
  test(`Деньги: ноль, копейки и разделитель тысяч (${locale})`, () => {
    assert.equal(formatMoney(0, locale), "0,00");
    assert.equal(formatMoney(1, locale), "0,01");
    assert.equal(formatMoney(105025, locale), "1\u00a0050,25");
  });
}

test("Дата прихода переводится в киевское время при переходе на новый год", () => {
  assert.deepEqual(formatOrderDate("2026-12-31T22:30:00Z", "ru"), { short: "01 / 01", long: "01 / янв / 2027" });
  assert.deepEqual(formatOrderDate("2026-12-31T22:30:00Z", "uk"), { short: "01 / 01", long: "01 / січ / 2027" });
});

test("Летнее смещение Киева учитывается при переходе на следующий день", () => {
  assert.equal(formatOrderDate("2026-07-01T21:30:00Z", "uk").short, "02 / 07");
});

test("Календарная дата гарантии не сдвигается, месяц переводится", () => {
  assert.deepEqual(formatOrderDate("2026-09-28", "ru"), { short: "28 / 09", long: "28 / сент / 2026" });
  assert.deepEqual(formatOrderDate("2026-09-28", "uk"), { short: "28 / 09", long: "28 / вер / 2026" });
});

for (const [locale, one, few, many] of [
  ["ru", "продукт", "продукта", "продуктов"],
  ["uk", "продукт", "продукти", "продуктів"],
]) {
  test(`Склонения счётчика: 0, 1, 2, 5, 11–14, 21, 22, 25, 101 (${locale})`, () => {
    for (const [count, expected] of [[0, many], [1, one], [2, few], [5, many], [11, many], [12, many], [14, many], [21, one], [22, few], [25, many], [101, one]]) {
      assert.equal(productCountLabel(count, locale), expected, `count=${count}`);
    }
  });
}
