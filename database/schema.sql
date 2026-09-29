-- MySQL 8.0.16+ / 8.4, InnoDB. Initial schema; run once on an empty database.
-- Also suitable for MySQL Workbench: Import > Reverse Engineer MySQL Create Script.
CREATE DATABASE IF NOT EXISTS orders_products
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE orders_products;

CREATE TABLE orders (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  created_at DATETIME NOT NULL COMMENT 'UTC',
  PRIMARY KEY (id),
  KEY idx_orders_created_at (created_at)
) ENGINE=InnoDB;

CREATE TABLE product_types (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_product_types_name (name)
) ENGINE=InnoDB;

CREATE TABLE products (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id INT UNSIGNED NOT NULL,
  type_id INT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  serial_number VARCHAR(100) NOT NULL,
  is_new BOOLEAN NOT NULL,
  photo VARCHAR(2048) NULL,
  specification TEXT NOT NULL,
  guarantee_start DATE NOT NULL,
  guarantee_end DATE NOT NULL,
  created_at DATETIME NOT NULL COMMENT 'UTC',
  PRIMARY KEY (id),
  KEY idx_products_order_id (order_id),
  KEY idx_products_type_id (type_id),
  CONSTRAINT fk_products_order FOREIGN KEY (order_id)
    REFERENCES orders (id) ON DELETE CASCADE,
  CONSTRAINT fk_products_type FOREIGN KEY (type_id)
    REFERENCES product_types (id) ON DELETE RESTRICT,
  CONSTRAINT chk_products_is_new CHECK (is_new IN (0, 1)),
  CONSTRAINT chk_products_guarantee CHECK (guarantee_end >= guarantee_start)
) ENGINE=InnoDB;

CREATE TABLE product_prices (
  product_id INT UNSIGNED NOT NULL,
  currency CHAR(3) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  amount_minor INT UNSIGNED NOT NULL COMMENT 'Cents or kopecks, no conversion',
  is_default BOOLEAN NOT NULL,
  -- NULL values allow several non-default prices, but only one default per product.
  default_slot TINYINT GENERATED ALWAYS AS
    (CASE WHEN is_default = 1 THEN 1 ELSE NULL END) VIRTUAL,
  PRIMARY KEY (product_id, currency),
  UNIQUE KEY uq_product_prices_default (product_id, default_slot),
  CONSTRAINT fk_product_prices_product FOREIGN KEY (product_id)
    REFERENCES products (id) ON DELETE CASCADE,
  CONSTRAINT chk_product_prices_currency CHECK (currency IN ('USD', 'UAH')),
  CONSTRAINT chk_product_prices_is_default CHECK (is_default IN (0, 1))
) ENGINE=InnoDB;
