-- Initial demo data matching apps/web/src/data/inventory.ts. Run once after schema.sql.
SET NAMES utf8mb4;
USE orders_products;
START TRANSACTION;

INSERT INTO orders (id, title, description, created_at) VALUES
  (1, 'Поставка мониторов для рабочего пространства', 'Оборудование для рабочих мест', '2026-09-28 09:00:00'),
  (2, 'Комплектующие для отдела разработки', 'Обновление компьютеров', '2026-09-21 09:00:00'),
  (3, 'Дополнительное оборудование для переговорной и новых рабочих мест', 'Расширение офиса', '2026-08-15 09:00:00'),
  (4, 'Плановая поставка периферии', 'Товары пока не добавлены', '2026-07-06 09:00:00');

INSERT INTO product_types (id, name) VALUES
  (1, 'Мониторы'),
  (2, 'Накопители'),
  (3, 'Клавиатуры');

INSERT INTO products (id, order_id, type_id, title, serial_number, is_new, photo, specification, guarantee_start, guarantee_end, created_at) VALUES
  (1, 1, 1, 'Монитор Dell P2425H', 'DL-24001', 1, NULL, '24 дюйма, Full HD', '2026-09-28', '2029-09-28', '2026-09-28 09:00:00'),
  (2, 1, 1, 'Монитор LG 27UP650', 'LG-27002', 1, NULL, '27 дюймов, 4K', '2026-09-28', '2028-09-28', '2026-09-28 09:00:00'),
  (3, 2, 2, 'Накопитель Samsung 990 PRO', 'SSD-10003', 1, NULL, 'SSD, 1 ТБ', '2026-09-21', '2029-09-21', '2026-09-21 09:00:00'),
  (4, 3, 3, 'Клавиатура Logitech K120', 'KB-00004', 1, NULL, 'Проводная, USB', '2026-08-15', '2028-08-15', '2026-08-15 09:00:00'),
  (5, 3, 1, 'Монитор Dell P2419H', 'DL-24005', 0, NULL, '24 дюйма, Full HD', '2026-08-15', '2027-08-15', '2026-08-15 09:00:00');

INSERT INTO product_prices (product_id, currency, amount_minor, is_default) VALUES
  (1, 'USD', 25000, 0),
  (1, 'UAH', 1050000, 1),
  (2, 'USD', 32999, 0),
  (2, 'UAH', 1399950, 1),
  (3, 'USD', 12050, 0),
  (3, 'UAH', 510025, 1),
  (4, 'USD', 1590, 0),
  (4, 'UAH', 67500, 1),
  (5, 'USD', 10000, 0),
  (5, 'UAH', 420000, 1);

COMMIT;
