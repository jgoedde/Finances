PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS categories
(
    id        INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name      TEXT                              NOT NULL UNIQUE,
    color     TEXT                              NOT NULL UNIQUE,
    icon_name TEXT                              NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS expenses
(
    id          TEXT PRIMARY KEY NOT NULL,
    date        TEXT             NOT NULL DEFAULT (datetime('now')),
    name        TEXT             NOT NULL,
    description TEXT,
    amount      NUMERIC          NOT NULL,
    currency    TEXT             NOT NULL,
    category_id INTEGER          NOT NULL,
    FOREIGN KEY (category_id)
        REFERENCES categories (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

INSERT INTO categories ("id", "name", "color", "icon_name")
VALUES ('1', 'Auswärts essen', '#00202e', 'utensils'),
       ('2', 'Einkäufe', '#2c4875', 'shopping-basket'),
       ('3', 'Geschenke', '#8a508f', 'gift'),
       ('4', 'Gesundheit', '#bc5090', 'heart'),
       ('5', 'Kleidung', '#ff8531', 'shirt'),
       ('6', 'Freizeit', '#ffa600', 'joystick'),
       ('7', 'Urlaub', '#80d353', 'plane'),
       ('8', 'Büro/Arbeit', '#609f3f', 'lamp-desk'),
       ('9', 'Snacks', '#D8DC6A', 'popcorn');