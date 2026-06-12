PRAGMA foreign_keys = ON;

create table if not exists categories
(
    id        INTEGER not null
        primary key autoincrement,
    name      TEXT    not null
        unique,
    color     TEXT    not null
        unique,
    icon_name TEXT    not null
        unique
);

create table if not exists expenses
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
            on update cascade on delete restrict,
    exceptional INTEGER default 0                 not null
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
       ('10', 'Wohnung', '#ff6361', 'sofa')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS fixed_costs
(
    id          INTEGER                       NOT NULL
        PRIMARY KEY AUTOINCREMENT,
    name        TEXT                          NOT NULL,
    description TEXT    DEFAULT NULL,
    amount      NUMERIC                       NOT NULL,
    currency    TEXT    DEFAULT 'EUR'         NOT NULL,
    interval    TEXT    DEFAULT 'monthly'     NOT NULL
        CHECK (interval IN ('monthly', 'quarterly', 'yearly')),
    category_id INTEGER                       NOT NULL
        REFERENCES categories ON UPDATE CASCADE ON DELETE RESTRICT,
    active      INTEGER DEFAULT 1             NOT NULL
        CHECK (active IN (0, 1)),
    start_date  TEXT    DEFAULT (date('now')) NOT NULL,
    end_date    TEXT    DEFAULT NULL
);

create table IF NOT EXISTS fixed_cost_categories
(
    id          integer not null
        constraint fixed_cost_categories_pk
            primary key autoincrement,
    name        text    not null
        constraint fixed_cost_categories_unique_name
            unique,
    description text default null
);

INSERT INTO fixed_cost_categories(id, name, description)
VALUES (1, 'Miete / Wohnung', 'inkl. Nebenkosten'),
       (2, 'Strom & Heizung', null),
       (3, 'Wasser / Abwasser', null),
       (4, 'Internet & Festnetz', null),
       (5, 'Mobilfunk / Handyvertrag', null),
       (6, 'Rundfunkbeitrag / TV-Streaming-Abos', 'z. B. Netflix'),
       (7, 'Versicherungen', 'Hausrat, Haftpflicht, KFZ, Gesundheit Zusatz'),
       (8, 'Kredit / Darlehensraten', 'inkl. Ratenkäufe'),
       (9, 'ÖPNV-/Auto-Fixkosten', 'z. B. Leasing, Kfz-Steuer, feste Monatskarten'),
       (10, 'Abos & Mitgliedschaften', 'Fitnessstudio, Zeitschriften, Software'),
       (11, 'Gebühren & Beiträge', 'Kontoführungsgebühren, GEZ-ähnliches'),
       (12, 'Sonstige wiederkehrende Verträge', 'z. B. Wartungsverträge, Sicherheitsdienste')
ON CONFLICT DO NOTHING;

create table if not exists fixed_costs_dg_tmp
(
    id          INTEGER                       not null
        primary key autoincrement,
    name        TEXT                          not null,
    description TEXT    default NULL,
    amount      NUMERIC                       not null,
    currency    TEXT    default 'EUR'         not null,
    interval    TEXT    default 'monthly'     not null,
    category_id INTEGER                       not null
        constraint fixed_costs_fixed_cost_categories_id_fk
            references fixed_cost_categories
            on update cascade on delete restrict,
    active      INTEGER default 1             not null,
    start_date  TEXT    default (date('now')) not null,
    end_date    TEXT    default NULL,
    check (active IN (0, 1)),
    check (interval IN ('monthly', 'quarterly', 'yearly'))
);

insert into fixed_costs_dg_tmp(id, name, description, amount, currency, interval, category_id, active, start_date,
                               end_date)
select id,
       name,
       description,
       amount,
       currency,
       interval,
       category_id,
       active,
       start_date,
       end_date
from fixed_costs;

drop table fixed_costs;

alter table fixed_costs_dg_tmp
    rename to fixed_costs;

