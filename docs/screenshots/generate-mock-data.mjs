// Generates a fictional `finances-export` (version 7) for README screenshots.
// All dates are relative to the given day, so the current month is in
// progress and the patterns, the pace and the fixed cost suggestion show up.
//
//   node docs/screenshots/generate-mock-data.mjs [YYYY-MM-DD] > mock-data.json
//
// Import the output under Settings > Import into a fresh account.

process.env.TZ = "Europe/Berlin";

const todayArg = process.argv[2] ?? new Date().toISOString().slice(0, 10);
const [ty, tm, td] = todayArg.split("-").map(Number);
const TODAY = { y: ty, m: tm - 1, d: td };

// Deterministic PRNG (mulberry32), so the same day gives the same data.
let seed = 20261121;
function rand() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const between = (min, max) => min + rand() * (max - min);
const int = (min, max) => Math.floor(between(min, max + 1));
const pick = (items) => items[Math.floor(rand() * items.length)];
const chance = (p) => rand() < p;
const euros = (min, max) => Math.round(between(min, max) * 100) / 100;

const ALPHABET =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-";
function id() {
    let out = "";
    for (let i = 0; i < 8; i++) out += ALPHABET[int(0, 63)];
    return out;
}

/** The month `offset` months from the current one: `{ y, m }`. */
function month(offset) {
    const date = new Date(TODAY.y, TODAY.m + offset, 1);
    return { y: date.getFullYear(), m: date.getMonth() };
}
const daysIn = ({ y, m }) => new Date(y, m + 1, 0).getDate();
const iso = (y, m, d) =>
    `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
const isoMonth = (offset, d = 1) => {
    const { y, m } = month(offset);
    return iso(y, m, d);
};

/** Last day of the month that may get transactions (today in the current one). */
const lastDay = (offset) => (offset === 0 ? TODAY.d : daysIn(month(offset)));

/** A day of the month whose weekday (0 = Monday) is in `weekdays`. */
function dayOn(offset, weekdays) {
    const { y, m } = month(offset);
    const days = [];
    for (let d = 1; d <= lastDay(offset); d++) {
        const weekday = (new Date(y, m, d).getDay() + 6) % 7;
        if (weekdays.includes(weekday)) days.push(d);
    }
    return days.length ? pick(days) : int(1, lastDay(offset));
}

// Somewhere in Hamburg.
function location() {
    if (!chance(0.45)) return null;
    return {
        lat: Math.round((53.55 + between(-0.04, 0.04)) * 1e6) / 1e6,
        lng: Math.round((9.99 + between(-0.07, 0.07)) * 1e6) / 1e6,
        accuracy: int(8, 60),
    };
}

const transactions = [];
function add(offset, day, [hFrom, hTo], fields) {
    const { y, m } = month(offset);
    const hour = int(hFrom, hTo);
    // Today's transactions stay in the morning, before the screenshots.
    const safeHour = offset === 0 && day === TODAY.d ? Math.min(hour, 9) : hour;
    const transaction = {
        id: id(),
        date: new Date(y, m, day, safeHour, int(0, 59)).getTime(),
        counterparty: fields.counterparty,
        description: fields.description ?? null,
        kind: fields.kind ?? "expense",
        amount: fields.amount,
        currency: "EUR",
        categoryId: fields.categoryId,
        exceptional: fields.exceptional ?? false,
        location: fields.location === undefined ? location() : fields.location,
        mainExpenseId: fields.mainExpenseId ?? null,
    };
    transactions.push(transaction);
    return transaction;
}

const C = {
    eatingOut: "1",
    groceries: "2",
    gifts: "3",
    health: "4",
    clothing: "5",
    leisure: "6",
    travel: "7",
    office: "8",
    snacks: "9",
    home: "10",
    otherExpense: "fallback-expense",
    refunds: "income-refunds",
    friends: "income-friends",
    otherIncome: "fallback-income",
};

const FRI_SAT = [4, 5];
const MORNING = [7, 9];
const EVENING = [18, 21];

for (let offset = -13; offset <= 0; offset++) {
    const { m } = month(offset);
    const last = lastDay(offset);
    // Months scale down while in progress.
    const share = last / daysIn(month(offset));
    const n = (count) => Math.round(count * share);
    // The three months ending with the current one: more eating out.
    const recent = offset >= -2;

    // Groceries: weekly shop plus a few top-ups.
    for (let i = 0; i < n(int(7, 9)); i++) {
        const big = chance(0.5);
        add(offset, dayOn(offset, big ? [5] : [0, 1, 2, 3, 4]), [16, 19], {
            counterparty: big
                ? pick(["REWE", "Edeka"])
                : pick(["Lidl", "REWE", "Aldi Nord"]),
            amount: big ? euros(48, 95) : euros(12, 38),
            categoryId: C.groceries,
        });
    }

    // Bakery and coffee: many small purchases, mostly the same bakery.
    for (let i = 0; i < n(int(18, 24)); i++) {
        const bakery = chance(0.55);
        add(offset, dayOn(offset, [0, 1, 2, 3, 4]), MORNING, {
            counterparty: bakery
                ? "Schmidt Bakery"
                : pick(["Coffee Fellows", "Station Kiosk", "Balzac Coffee"]),
            amount: bakery ? euros(2.4, 6.9) : euros(3.2, 8.5),
            categoryId: C.snacks,
        });
    }

    // Eating out, mostly on Fridays and Saturdays; the main expense gets a tip.
    for (let i = 0; i < n(recent ? int(5, 6) : int(4, 5)); i++) {
        const day = chance(0.8)
            ? dayOn(offset, FRI_SAT)
            : dayOn(offset, [0, 1, 2, 3, 6]);
        const restaurant = pick([
            "Trattoria Da Marco",
            "Ramen Kazu",
            "Burger Vision",
            "Café Paris",
            "Thai Garden",
            "Lieferando",
        ]);
        const main = add(offset, day, EVENING, {
            counterparty: restaurant,
            amount: recent ? euros(24, 58) : euros(18, 46),
            categoryId: C.eatingOut,
        });
        if (restaurant !== "Lieferando" && chance(0.6)) {
            add(offset, day, EVENING, {
                counterparty: restaurant,
                description: "Tip",
                amount: Math.round(main.amount * 0.1),
                categoryId: C.eatingOut,
                location: main.location,
                mainExpenseId: main.id,
            });
        }
        // A friend pays their share back.
        if (main.amount > 40 && chance(0.5)) {
            add(offset, Math.min(day + 1, last), [10, 22], {
                kind: "income",
                counterparty: pick(["Lena", "Jonas", "Mira"]),
                description: `${restaurant}, their share`,
                amount: Math.round(main.amount / 2),
                categoryId: C.friends,
                location: null,
            });
        }
    }

    // Leisure.
    for (let i = 0; i < n(int(2, 4)); i++) {
        add(
            offset,
            dayOn(offset, [4, 5, 6]),
            [14, 21],
            pick(
                [
                    { counterparty: "Abaton Cinema", amount: euros(11, 24) },
                    {
                        counterparty: "Steam",
                        amount: euros(9.99, 39.99),
                        location: null,
                    },
                    { counterparty: "City Bowling", amount: euros(18, 32) },
                    { counterparty: "Climbing Gym", amount: euros(14, 16) },
                ].map((it) => ({ ...it, categoryId: C.leisure })),
            ),
        );
    }

    // Clothing: online orders with shipping, sometimes partly returned.
    if (chance(0.7) && n(1) > 0) {
        const day = int(1, last);
        const order = add(offset, day, [19, 22], {
            counterparty: "Zalando",
            amount: euros(39, 129),
            categoryId: C.clothing,
            location: null,
        });
        add(offset, day, [19, 22], {
            counterparty: "Zalando",
            description: "Shipping",
            amount: 4.9,
            categoryId: C.clothing,
            location: null,
            mainExpenseId: order.id,
        });
        if (chance(0.4) && day + 9 <= last) {
            add(offset, day + 9, [10, 16], {
                kind: "income",
                counterparty: "Zalando",
                description: "Return",
                amount: Math.round(order.amount * 0.4 * 100) / 100,
                categoryId: C.refunds,
                location: null,
            });
        }
    }

    // Health.
    for (let i = 0; i < n(int(1, 3)); i++) {
        add(offset, int(1, last), [9, 18], {
            counterparty: pick(["dm", "Market Pharmacy", "Rossmann"]),
            amount: euros(3.5, 24),
            categoryId: C.health,
        });
    }

    // Home.
    if (n(1) > 0) {
        add(offset, dayOn(offset, [5]), [11, 16], {
            counterparty: pick(["IKEA", "Bauhaus", "Butlers"]),
            amount: euros(20, 55),
            categoryId: C.home,
        });
    }

    // Gifts, more in December.
    for (let i = 0; i < (m === 11 ? 5 : chance(0.5) ? 1 : 0); i++) {
        add(offset, int(1, last), [12, 19], {
            counterparty: pick([
                "Thalia",
                "Amazon",
                "Lindner Flowers",
                "Manufactum",
            ]),
            amount: m === 11 ? euros(25, 80) : euros(15, 45),
            categoryId: C.gifts,
        });
    }

    // Office supplies now and then.
    if (chance(0.35) && n(1) > 0) {
        add(offset, int(1, last), [10, 17], {
            counterparty: pick(["Amazon", "McPaper", "Saturn"]),
            amount: euros(6, 35),
            categoryId: C.office,
            location: null,
        });
    }

    // Bottle deposit back and the odd uncategorized thing.
    if (chance(0.6)) {
        add(offset, int(1, last), [16, 19], {
            kind: "income",
            counterparty: "REWE",
            description: "Bottle deposit",
            amount: euros(1.5, 4.5),
            categoryId: C.otherIncome,
        });
    }
    if (chance(0.4)) {
        add(offset, int(1, last), [9, 20], {
            counterparty: pick(["Laundromat", "Locksmith", "Post Office"]),
            amount: euros(3, 12),
            categoryId: C.otherExpense,
        });
    }
}

// A city trip half a year ago, before the windows the patterns compare.
for (const [counterparty, description, amount] of [
    ["TAP Air Portugal", "Flight to Lisbon", 238.4],
    ["Airbnb", "Lisbon, 4 nights", 412],
    ["Time Out Market", null, 46.8],
    ["Pastéis de Belém", null, 9.6],
    ["Metro Lisboa", null, 12],
]) {
    add(-6, 17, [10, 20], {
        counterparty,
        description,
        amount,
        categoryId: C.travel,
        location: null,
    });
}

// One-off large purchase this month: left out of the insights.
add(0, Math.min(8, TODAY.d), [11, 15], {
    counterparty: "MediaMarkt",
    description: "New washing machine",
    amount: 649,
    categoryId: C.home,
    exceptional: true,
});

// A refund from the health insurer.
add(-1, 12, [10, 12], {
    kind: "income",
    counterparty: "Health insurance",
    description: "Dental cleaning refund",
    amount: 40,
    categoryId: C.refunds,
    location: null,
});

// Spotify was paid by hand for three months on today's day of the month.
// Adding it again today brings up the fixed cost suggestion.
for (const offset of [-3, -2, -1]) {
    add(offset, Math.min(TODAY.d, daysIn(month(offset))), [8, 9], {
        counterparty: "Spotify",
        amount: 11.99,
        categoryId: C.leisure,
        location: null,
    });
}

// Upcoming transactions (after today).
const upcoming = (days) =>
    new Date(TODAY.y, TODAY.m, TODAY.d + days, 19, 30).getTime();
transactions.push(
    {
        id: id(),
        date: upcoming(6),
        counterparty: "Eventim",
        description: "Concert, 2 tickets",
        kind: "expense",
        amount: 118,
        currency: "EUR",
        categoryId: C.leisure,
        exceptional: false,
        location: null,
        mainExpenseId: null,
    },
    {
        id: id(),
        date: upcoming(9),
        counterparty: "City Utilities",
        description: "Service charge top-up",
        kind: "expense",
        amount: 86.4,
        currency: "EUR",
        categoryId: C.home,
        exceptional: false,
        location: null,
        mainExpenseId: null,
    },
);

transactions.sort((a, b) => a.date - b.date);

const categories = [
    ["1", "Eating out", "#00202e", "utensils"],
    ["2", "Groceries", "#2c4875", "shopping-basket"],
    ["3", "Gifts", "#8a508f", "gift"],
    ["4", "Health", "#bc5090", "heart"],
    ["5", "Clothing", "#ff8531", "shirt"],
    ["6", "Leisure", "#ffa600", "joystick"],
    ["7", "Travel", "#80d353", "plane"],
    ["8", "Office/Work", "#609f3f", "lamp-desk"],
    ["9", "Snacks", "#d8dc6a", "popcorn"],
    ["10", "Home", "#ff6361", "sofa"],
]
    .map(([id, name, color, iconName]) => ({
        id,
        name,
        color,
        iconName,
        kind: "expense",
        fallback: false,
    }))
    .concat([
        {
            id: C.refunds,
            name: "Refunds",
            color: "#3a7bd5",
            iconName: "undo-2",
            kind: "income",
            fallback: false,
        },
        {
            id: C.friends,
            name: "Friends & family",
            color: "#b5651d",
            iconName: "users",
            kind: "income",
            fallback: false,
        },
        {
            id: "fallback-expense",
            color: "#7c7c7c",
            iconName: "circle-ellipsis",
            kind: "expense",
            fallback: true,
            name: null,
        },
        {
            id: "fallback-income",
            color: "#3f8f6b",
            iconName: "hand-coins",
            kind: "income",
            fallback: true,
            name: null,
        },
    ]);

const HUES = {
    1: 30,
    2: 90,
    3: 210,
    4: 300,
    5: 180,
    6: 0,
    7: 150,
    8: 270,
    9: 120,
    10: 330,
    11: 60,
    12: 240,
};
const fixedCostCategories = [
    ["1", "Rent / Housing", "incl. service charges"],
    ["2", "Electricity & heating", null],
    ["3", "Water / sewage", null],
    ["4", "Internet & landline", null],
    ["5", "Mobile phone", null],
    ["6", "Broadcasting fee / TV streaming", "e.g. Netflix"],
    ["7", "Insurance", "Home contents, liability, car, supplementary health"],
    ["8", "Loans / installments", "incl. installment purchases"],
    ["9", "Public transport / car", "e.g. leasing, car tax, monthly passes"],
    ["10", "Subscriptions & memberships", "Gym, magazines, software"],
    ["11", "Fees & charges", "Bank account fees, licence fees"],
    ["12", "Other recurring contracts", "e.g. maintenance, security services"],
].map(([id, name, description]) => ({ id, name, description, hue: HUES[id] }));

let fixedCostId = 0;
function fixedCost(
    name,
    categoryId,
    interval,
    startDate,
    initialAmount,
    options = {},
) {
    return {
        id: String(++fixedCostId),
        name,
        description: options.description ?? null,
        initialAmount,
        priceChanges: options.priceChanges ?? [],
        currency: "EUR",
        interval,
        categoryId,
        active: options.active ?? true,
        startDate,
        endDate: options.endDate ?? null,
    };
}

const fixedCosts = [
    fixedCost("Rent", "1", "monthly", isoMonth(-32), 890, {
        description: "Rent + service charges",
        priceChanges: [{ date: isoMonth(-8), amount: 935 }],
    }),
    fixedCost("City Utilities Power", "2", "monthly", isoMonth(-32), 78, {
        priceChanges: [
            { date: isoMonth(-16), amount: 72 },
            // Announced, still ahead.
            { date: isoMonth(2), amount: 84 },
        ],
    }),
    fixedCost("City Water", "3", "quarterly", isoMonth(-30), 54),
    fixedCost("Vodafone Cable", "4", "monthly", isoMonth(-32), 39.99),
    fixedCost("congstar", "5", "monthly", isoMonth(-40), 15, {
        priceChanges: [{ date: isoMonth(-6), amount: 17 }],
    }),
    fixedCost("Broadcasting fee", "6", "quarterly", isoMonth(-31), 55.08),
    fixedCost("Netflix", "6", "monthly", isoMonth(-26), 13.99, {
        priceChanges: [{ date: isoMonth(-13), amount: 15.49 }],
    }),
    fixedCost("Disney+", "6", "monthly", isoMonth(-21), 9.99, {
        active: false,
    }),
    fixedCost("Liability insurance", "7", "yearly", isoMonth(-30), 64.9),
    fixedCost("Home contents insurance", "7", "yearly", isoMonth(-30), 89),
    fixedCost("Dental insurance", "7", "monthly", isoMonth(-21), 18.5),
    fixedCost("Sofa installments", "8", "monthly", isoMonth(-14), 79, {
        description: "24 installments",
        endDate: isoMonth(10, 1),
    }),
    fixedCost("Transit pass", "9", "monthly", isoMonth(-32), 49, {
        priceChanges: [
            { date: isoMonth(-22), amount: 58 },
            { date: isoMonth(-10), amount: 63 },
        ],
    }),
    fixedCost("Urban Gym", "10", "monthly", isoMonth(-22), 29.9),
    fixedCost("Cloud storage", "10", "monthly", isoMonth(-32), 2.99, {
        priceChanges: [{ date: isoMonth(-14), amount: 9.99 }],
    }),
    fixedCost("Tech magazine", "10", "yearly", isoMonth(-29), 129, {
        endDate: isoMonth(-6, 1),
    }),
    fixedCost("Bank account fee", "11", "monthly", isoMonth(-32), 4.95),
];

const data = {
    format: "finances-export",
    version: 7,
    exportedAt: new Date().toISOString(),
    categories,
    fixedCostCategories,
    fixedCosts,
    transactions,
};

process.stdout.write(`${JSON.stringify(data, null, 4)}\n`);
