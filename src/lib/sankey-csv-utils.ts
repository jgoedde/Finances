import { formatEuro } from "@/lib/currency-utils.ts";

function sanitizeForSankey(name: string): string {
    return name
        .replace(/ä/g, "ae")
        .replace(/ö/g, "oe")
        .replace(/ü/g, "ue")
        .replace(/Ä/g, "Ae")
        .replace(/Ö/g, "Oe")
        .replace(/Ü/g, "Ue")
        .replace(/ß/g, "ss")
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

interface IncomeSource {
    name: string;
    amount: number;
}

interface FixedCost {
    name: string;
    amount: number;
}

interface SavingsTarget {
    name: string;
    amount: number;
}

interface Expense {
    name: string;
    category_id: number;
    amount: number;
}

interface SankeyCSVConfig {
    monthIndex: number;
    year: number;
    incomeSources: IncomeSource[];
    fixedCosts: FixedCost[];
    savingsTargets: SavingsTarget[];
    transactions: Expense[];
}

export function buildSankeyCSV(config: SankeyCSVConfig): string {
    const {
        monthIndex,
        year,
        incomeSources,
        fixedCosts,
        savingsTargets,
        transactions,
    } = config;

    const incomes = transactions.filter((e) => e.amount < 0);
    const expenses = transactions.filter((e) => e.amount >= 0);

    const ausweartsEssen = expenses
        .filter((e) => e.category_id === 1)
        .reduce((sum, e) => sum + e.amount, 0);

    const einkaeufe = expenses
        .filter((e) => e.category_id === 2)
        .reduce((sum, e) => sum + e.amount, 0);

    const gesundheit = expenses
        .filter((e) => e.category_id === 4)
        .reduce((sum, e) => sum + e.amount, 0);

    const sonstiges = expenses
        .filter(
            (e) =>
                e.category_id !== 1 &&
                e.category_id !== 2 &&
                e.category_id !== 4,
        )
        .reduce((sum, e) => sum + e.amount, 0);

    const totalFixedIncome = incomeSources.reduce(
        (sum, s) => sum + (s.amount || 0),
        0,
    );
    const totalTrackedIncome = incomes.reduce(
        (sum, e) => sum + Math.abs(e.amount),
        0,
    );
    const totalFixedCosts = fixedCosts.reduce(
        (sum, c) => sum + (c.amount || 0),
        0,
    );
    const totalSavings = savingsTargets.reduce(
        (sum, s) => sum + (s.amount || 0),
        0,
    );
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const unspentMoney =
        totalFixedIncome +
        totalTrackedIncome -
        totalFixedCosts -
        totalSavings -
        totalExpenses;

    const monthName = new Date(year, monthIndex).toLocaleString("en-US", {
        month: "long",
    });

    let csv = `# Financial Overview - ${monthName} ${year}\n\n`;
    csv += `## Key Facts\n\n`;
    csv += `- **Month:** ${monthName} ${year}\n`;
    csv += `- **Total Income:** ${formatEuro(totalFixedIncome.toFixed(2))}\n`;
    csv += `- **Tracked Income:** ${formatEuro(totalTrackedIncome.toFixed(2))}\n`;
    csv += `- **Fixed Costs:** ${formatEuro(totalFixedCosts.toFixed(2))}\n`;
    csv += `- **Expenses:** ${formatEuro(totalExpenses.toFixed(2))}\n`;
    csv += `- **Savings:** ${formatEuro(totalSavings.toFixed(2))}\n`;
    csv += `- **Unspent Money:** ${formatEuro(unspentMoney.toFixed(2))}\n\n`;
    csv += `---\n\n`;
    csv += `\`\`\`mermaid\n`;
    csv += `---\nconfig:\n  sankey:\n    showValues: true\n---\n\n`;
    csv += `sankey-beta\n`;

    incomeSources.forEach((source) => {
        if (source.name && source.amount) {
            csv += `${sanitizeForSankey(source.name)},budget,${Math.round(source.amount)}\n`;
        }
    });

    incomes.forEach((income) => {
        if (income.name && income.amount < 0) {
            const safeName = sanitizeForSankey(income.name);
            csv += `${safeName},budget,${Math.round(Math.abs(income.amount))}\n`;
        }
    });

    csv += `\nbudget,fixkosten,${Math.round(totalFixedCosts)}\n\n`;

    fixedCosts.forEach((cost) => {
        if (cost.name && cost.amount) {
            csv += `fixkosten,${sanitizeForSankey(cost.name)},${Math.round(cost.amount)}\n`;
        }
    });

    const taeglichTotal = ausweartsEssen + einkaeufe + sonstiges;
    csv += `\nbudget,Taeglicher Bedarf,${Math.round(taeglichTotal)}\n`;
    csv += `Taeglicher Bedarf,auswaerts essen,${Math.round(ausweartsEssen)}\n`;
    csv += `Taeglicher Bedarf,einkaeufe,${Math.round(einkaeufe)}\n`;
    if (sonstiges > 0) {
        csv += `Taeglicher Bedarf,sonstiges,${Math.round(sonstiges)}\n`;
    }

    if (gesundheit > 0) {
        csv += `\nbudget,Gesundheit,${Math.round(gesundheit)}\n`;
    }

    if (totalSavings > 0) {
        csv += `\nbudget,sparen,${Math.round(totalSavings)}\n`;
        savingsTargets.forEach((target) => {
            if (target.name && target.amount) {
                csv += `sparen,${sanitizeForSankey(target.name)},${Math.round(target.amount)}\n`;
            }
        });
    }

    csv += `\`\`\`\n`;

    return csv;
}

export function downloadSankeyCSV(csvContent: string, filename: string): void {
    const blob = new Blob([csvContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
