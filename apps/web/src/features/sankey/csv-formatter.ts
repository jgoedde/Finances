import { getLocale } from "#/paraglide/runtime.js";
import { formatCurrency } from "@finances/shared";
import type { Category } from "@finances/shared";

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

interface Transaction {
    name: string;
    category_id: string;

    /**
     * Signed: negative is income.
     */
    amount: number;
}

interface SankeyCSVConfig {
    monthIndex: number;
    year: number;
    incomeSources: IncomeSource[];
    fixedCosts: FixedCost[];
    savingsTargets: SavingsTarget[];
    transactions: Transaction[];
    categories: Category[];
}

export function buildSankeyCSV(config: SankeyCSVConfig): string {
    const {
        monthIndex,
        year,
        incomeSources,
        fixedCosts,
        savingsTargets,
        transactions,
        categories,
    } = config;

    const incomes = transactions.filter((e) => e.amount < 0);
    const expenses = transactions.filter((e) => e.amount >= 0);

    const categoryTotals = new Map<string, { name: string; amount: number }>();
    expenses.forEach((expense) => {
        const existing = categoryTotals.get(expense.category_id);
        if (existing) {
            existing.amount += expense.amount;
        } else {
            const category = categories.find(
                (c) => c.id === expense.category_id,
            );
            categoryTotals.set(expense.category_id, {
                name: category?.name || "Unknown",
                amount: expense.amount,
            });
        }
    });

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
    csv += `- **Total Income:** ${formatCurrency(totalFixedIncome, getLocale())}\n`;
    csv += `- **Tracked Income:** ${formatCurrency(totalTrackedIncome, getLocale())}\n`;
    csv += `- **Fixed Costs:** ${formatCurrency(totalFixedCosts, getLocale())}\n`;
    csv += `- **Expenses:** ${formatCurrency(totalExpenses, getLocale())}\n`;
    csv += `- **Savings:** ${formatCurrency(totalSavings, getLocale())}\n`;
    csv += `- **Unspent Money:** ${formatCurrency(unspentMoney, getLocale())}\n\n`;
    csv += `---\n\n`;
    csv += `\`\`\`mermaid\n`;
    csv += `---\nconfig:\n  sankey:\n    showValues: true\n---\n\n`;
    csv += `sankey-beta\n`;

    incomeSources.forEach((source) => {
        if (source.name && source.amount) {
            csv += `${sanitizeForSankey(source.name)},Budget,${Math.round(source.amount)}\n`;
        }
    });

    incomes.forEach((income) => {
        if (income.name && income.amount < 0) {
            const safeName = sanitizeForSankey(income.name);
            csv += `${safeName},Budget,${Math.round(Math.abs(income.amount))}\n`;
        }
    });

    csv += `\nBudget,Fixkosten,${Math.round(totalFixedCosts)}\n\n`;

    const mergedFixedCosts = mergeSmallEntries(fixedCosts, totalFixedCosts);

    mergedFixedCosts.items.forEach((cost) => {
        if (cost.name && cost.amount) {
            csv += `Fixkosten,${sanitizeForSankey(cost.name)},${Math.round(cost.amount)}\n`;
        }
    });

    if (mergedFixedCosts.mergedTotal > 0) {
        csv += `Fixkosten,andere Fixkosten,${Math.round(mergedFixedCosts.mergedTotal)}\n`;
    }

    const totalExpensesByCat = Array.from(categoryTotals.values());
    const totalVariableCosts = totalExpensesByCat.reduce(
        (sum, cat) => sum + cat.amount,
        0,
    );

    csv += `\nBudget,Variable Kosten,${Math.round(totalVariableCosts)}\n`;

    const mergedVariableCosts = mergeSmallEntries(
        totalExpensesByCat,
        totalVariableCosts,
    );

    mergedVariableCosts.items.forEach((cat) => {
        if (cat.name && cat.amount > 0) {
            csv += `Variable Kosten,${sanitizeForSankey(cat.name)},${Math.round(cat.amount)}\n`;
        }
    });

    if (mergedVariableCosts.mergedTotal > 0) {
        csv += `Variable Kosten,andere Ausgaben,${Math.round(mergedVariableCosts.mergedTotal)}\n`;
    }

    if (totalSavings > 0) {
        csv += `\nBudget,Investieren,${Math.round(totalSavings)}\n`;

        savingsTargets.forEach((target) => {
            if (target.name && target.amount) {
                csv += `Investieren,${sanitizeForSankey(target.name)},${Math.round(target.amount)}\n`;
            }
        });
    }

    csv += `\`\`\`\n\n`;
    csv += `---\n\n`;
    csv += `## Detailed Breakdown\n\n`;

    if (incomeSources.length > 0) {
        csv += `### Income Sources\n\n`;
        incomeSources.forEach((source) => {
            csv += `- **${source.name}**: ${formatCurrency(source.amount, getLocale())}\n`;
        });
        csv += `\n`;
    }

    if (incomes.length > 0) {
        csv += `### Tracked Income\n\n`;
        incomes.forEach((income) => {
            csv += `- **${income.name}**: ${formatCurrency(Math.abs(income.amount), getLocale())}\n`;
        });
        csv += `\n`;
    }

    if (
        mergedFixedCosts.items.length > 0 ||
        mergedFixedCosts.merged.length > 0
    ) {
        csv += `### Fixed Costs\n\n`;
        mergedFixedCosts.items.forEach((cost) => {
            csv += `- **${cost.name}**: ${formatCurrency(cost.amount, getLocale())}\n`;
        });
        if (mergedFixedCosts.merged.length > 0) {
            csv += `\n**Other Fixed Costs** (${formatCurrency(mergedFixedCosts.mergedTotal, getLocale())}):\n`;
            mergedFixedCosts.merged.forEach((cost) => {
                csv += `- ${cost.name}: ${formatCurrency(cost.amount, getLocale())}\n`;
            });
        }
        csv += `\n`;
    }

    if (
        mergedVariableCosts.items.length > 0 ||
        mergedVariableCosts.merged.length > 0
    ) {
        csv += `### Variable Costs\n\n`;
        mergedVariableCosts.items.forEach((cat) => {
            csv += `- **${cat.name}**: ${formatCurrency(cat.amount, getLocale())}\n`;
        });
        if (mergedVariableCosts.merged.length > 0) {
            csv += `\n**Other Expenses** (${formatCurrency(mergedVariableCosts.mergedTotal, getLocale())}):\n`;
            mergedVariableCosts.merged.forEach((cat) => {
                csv += `- ${cat.name}: ${formatCurrency(cat.amount, getLocale())}\n`;
            });
        }
        csv += `\n`;
    }

    if (totalSavings > 0) {
        csv += `### Savings\n\n`;
        savingsTargets.forEach((target) => {
            csv += `- **${target.name}**: ${formatCurrency(target.amount, getLocale())}\n`;
        });
        csv += `\n`;
    }

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

const MERGE_THRESHOLD_PERCENT = 10;

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

interface MergedEntry<T> {
    items: T[];
    merged: T[];
    mergedTotal: number;
}

function mergeSmallEntries<T extends { name: string; amount: number }>(
    entries: T[],
    total: number,
): MergedEntry<T> {
    const threshold = total * (MERGE_THRESHOLD_PERCENT / 100);
    const items: T[] = [];
    const merged: T[] = [];
    let mergedTotal = 0;

    entries.forEach((entry) => {
        if (entry.amount && entry.amount >= threshold) {
            items.push(entry);
        } else if (entry.amount) {
            merged.push(entry);
            mergedTotal += entry.amount;
        }
    });

    return { items, merged, mergedTotal };
}
