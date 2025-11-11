import { formatEuro } from "@/lib/currency-utils.ts";

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
    category_id: number;
    amount: number;
}

interface SankeyCSVConfig {
    monthIndex: number;
    year: number;
    incomeSources: IncomeSource[];
    fixedCosts: FixedCost[];
    savingsTargets: SavingsTarget[];
    expenses: Expense[];
}

export function buildSankeyCSV(config: SankeyCSVConfig): string {
    const {
        monthIndex,
        year,
        incomeSources,
        fixedCosts,
        savingsTargets,
        expenses,
    } = config;

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

    const totalIncome = incomeSources.reduce(
        (sum, s) => sum + (s.amount || 0),
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
        totalIncome - totalFixedCosts - totalSavings - totalExpenses;

    const monthName = new Date(year, monthIndex).toLocaleString("en-US", {
        month: "long",
    });

    let csv = `# Financial Overview - ${monthName} ${year}\n\n`;
    csv += `## Key Facts\n\n`;
    csv += `- **Month:** ${monthName} ${year}\n`;
    csv += `- **Total Income:** ${formatEuro(totalIncome.toFixed(2))}\n`;
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
            csv += `${source.name},budget,${Math.round(source.amount)}\n`;
        }
    });

    csv += `\nbudget,fixkosten,${Math.round(totalFixedCosts)}\n\n`;

    fixedCosts.forEach((cost) => {
        if (cost.name && cost.amount) {
            csv += `fixkosten,${cost.name},${Math.round(cost.amount)}\n`;
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
                csv += `sparen,${target.name},${Math.round(target.amount)}\n`;
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
