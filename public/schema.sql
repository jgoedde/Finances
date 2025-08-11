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