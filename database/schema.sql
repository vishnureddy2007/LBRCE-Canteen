-- =====================================================================
-- LBRCE Canteen Management System
-- Database Schema (MySQL 8.0+)
--
-- Usage:
--   mysql -u root -p < schema.sql
--
-- Notes:
--   * All tables use InnoDB and utf8mb4 for full Unicode support.
--   * Primary keys are BIGINT AUTO_INCREMENT.
--   * Decimals are used for money to avoid floating-point errors.
--   * Timestamps default to CURRENT_TIMESTAMP and update on row update.
-- =====================================================================

-- Drop database if exists (uncomment for a clean re-install)
-- DROP DATABASE IF EXISTS lbrce_canteen;

CREATE DATABASE IF NOT EXISTS lbrce_canteen
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE lbrce_canteen;

-- ---------------------------------------------------------------------
-- Users
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS admins (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    username        VARCHAR(80)     NOT NULL,
    email           VARCHAR(120)    NOT NULL,
    password_hash   VARCHAR(255)    NOT NULL,
    full_name       VARCHAR(120)    NOT NULL,
    phone           VARCHAR(20),
    role            VARCHAR(20)     NOT NULL DEFAULT 'ADMIN',
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_admin_username (username),
    UNIQUE KEY uk_admin_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS students (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    roll_number     VARCHAR(20)     NOT NULL,
    email           VARCHAR(120)    NOT NULL,
    password_hash   VARCHAR(255)    NOT NULL,
    full_name       VARCHAR(120)    NOT NULL,
    phone           VARCHAR(20),
    department      VARCHAR(60),
    year_of_study   INT,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_student_roll (roll_number),
    UNIQUE KEY uk_student_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS staff (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    employee_id     VARCHAR(20)     NOT NULL,
    email           VARCHAR(120)    NOT NULL,
    password_hash   VARCHAR(255)    NOT NULL,
    full_name       VARCHAR(120)    NOT NULL,
    phone           VARCHAR(20),
    shift           VARCHAR(20),       -- MORNING / EVENING / NIGHT
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_staff_emp (employee_id),
    UNIQUE KEY uk_staff_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- Menu
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS categories (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    name            VARCHAR(40)     NOT NULL,
    display_order   INT             NOT NULL DEFAULT 0,
    active          BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_category_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS food_items (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    name            VARCHAR(120)    NOT NULL,
    description     TEXT,
    price           DECIMAL(10, 2)  NOT NULL,
    category_id     BIGINT          NOT NULL,
    available       BOOLEAN         NOT NULL DEFAULT TRUE,
    rating_avg      DECIMAL(3, 2)   NOT NULL DEFAULT 0.00,
    rating_count    INT             NOT NULL DEFAULT 0,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_food_category (category_id),
    KEY idx_food_available (available),
    CONSTRAINT fk_food_category
        FOREIGN KEY (category_id) REFERENCES categories (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS food_images (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    food_item_id    BIGINT          NOT NULL,
    image_url       VARCHAR(255)    NOT NULL,
    is_primary      BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_image_food (food_item_id),
    CONSTRAINT fk_image_food
        FOREIGN KEY (food_item_id) REFERENCES food_items (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- Orders
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS orders (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    order_number    VARCHAR(30)     NOT NULL,
    student_id      BIGINT          NOT NULL,
    status          ENUM('PLACED','PREPARING','READY','DELIVERED','CANCELLED')
                                    NOT NULL DEFAULT 'PLACED',
    total_amount    DECIMAL(10, 2)  NOT NULL DEFAULT 0.00,
    payment_method  ENUM('CASH','UPI') NOT NULL,
    payment_status  ENUM('PENDING','PAID','REFUNDED')
                                    NOT NULL DEFAULT 'PENDING',
    notes           VARCHAR(255),
    placed_at       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    accepted_at     TIMESTAMP       NULL,
    prepared_at     TIMESTAMP       NULL,
    ready_at        TIMESTAMP       NULL,
    delivered_at    TIMESTAMP       NULL,
    cancelled_at    TIMESTAMP       NULL,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_order_number (order_number),
    KEY idx_order_student (student_id),
    KEY idx_order_status (status),
    KEY idx_order_placed_at (placed_at),
    CONSTRAINT fk_order_student
        FOREIGN KEY (student_id) REFERENCES students (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS order_items (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    order_id        BIGINT          NOT NULL,
    food_item_id    BIGINT          NOT NULL,
    food_name       VARCHAR(120)    NOT NULL,   -- snapshot
    quantity        INT             NOT NULL,
    unit_price      DECIMAL(10, 2)  NOT NULL,   -- snapshot
    subtotal        DECIMAL(10, 2)  NOT NULL,
    PRIMARY KEY (id),
    KEY idx_oi_order (order_id),
    KEY idx_oi_food (food_item_id),
    CONSTRAINT fk_oi_order
        FOREIGN KEY (order_id) REFERENCES orders (id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_oi_food
        FOREIGN KEY (food_item_id) REFERENCES food_items (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS payments (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    order_id        BIGINT          NOT NULL,
    method          ENUM('CASH','UPI') NOT NULL,
    amount          DECIMAL(10, 2)  NOT NULL,
    status          ENUM('PENDING','PAID','REFUNDED') NOT NULL DEFAULT 'PENDING',
    transaction_ref VARCHAR(120),
    paid_at         TIMESTAMP       NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_payment_order (order_id),
    CONSTRAINT fk_payment_order
        FOREIGN KEY (order_id) REFERENCES orders (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- Feedback
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS feedback (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    student_id      BIGINT          NOT NULL,
    order_id        BIGINT,
    food_item_id    BIGINT,
    rating          INT             NOT NULL,   -- 1..5
    comment         TEXT,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_fb_student (student_id),
    KEY idx_fb_food (food_item_id),
    CONSTRAINT fk_fb_student
        FOREIGN KEY (student_id) REFERENCES students (id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_fb_order
        FOREIGN KEY (order_id) REFERENCES orders (id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_fb_food
        FOREIGN KEY (food_item_id) REFERENCES food_items (id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_fb_rating CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- Announcements & Offers
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS announcements (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    title           VARCHAR(150)    NOT NULL,
    body            TEXT            NOT NULL,
    active          BOOLEAN         NOT NULL DEFAULT TRUE,
    starts_at       TIMESTAMP       NULL,
    ends_at         TIMESTAMP       NULL,
    created_by      BIGINT,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_ann_active (active),
    CONSTRAINT fk_ann_admin
        FOREIGN KEY (created_by) REFERENCES admins (id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS offers (
    id                  BIGINT          NOT NULL AUTO_INCREMENT,
    title               VARCHAR(150)    NOT NULL,
    description         TEXT,
    discount_percent    DECIMAL(5, 2)   NOT NULL,
    active              BOOLEAN         NOT NULL DEFAULT TRUE,
    valid_from          TIMESTAMP       NULL,
    valid_to            TIMESTAMP       NULL,
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_offer_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;