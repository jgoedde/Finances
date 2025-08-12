PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS categories
(
    id        INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name      TEXT                              NOT NULL UNIQUE,
    color     TEXT                              NOT NULL UNIQUE,
    icon_name TEXT                              NOT NULL UNIQUE
);

-- auto-generated definition
CREATE TABLE IF NOT EXISTS expenses
(
    id          TEXT                              not null
        primary key,
    date        INTEGER default (datetime('now')) not null,
    name        TEXT                              not null,
    description TEXT    default null,
    amount      NUMERIC                           not null,
    currency    TEXT                              not null,
    category_id INTEGER                           not null
        references categories
            on update cascade on delete restrict
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
       ('9', 'Snacks', '#D8DC6A', 'popcorn'),
       ('10', 'Wohnung', '#ff6361', 'sofa');;