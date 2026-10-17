import { useLocalStorage } from "@mantine/hooks";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Plus, TableOfContents, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { endOfMonth, startOfMonth } from "date-fns";
import {
    buildSankeyCSV,
    downloadSankeyCSV,
} from "@/features/sankey/csv-formatter.ts";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useQueryClient } from "@tanstack/react-query";
import {
    categoriesQuery,
    transactionsQuery,
} from "@/features/transactions/transaction-queries.ts";
import { fixedCostsQuery } from "@/features/fixed-costs/fixed-cost-queries.ts";
import { isRunningOn, toFixedCost } from "@/features/fixed-costs/fixed-cost.ts";
import { nanoid } from "nanoid";

interface IncomeSource {
    id: string;
    name: string;
    amount: string;
}

interface SavingsTarget {
    id: string;
    name: string;
    amount: string;
}

export function ExportSankeyDialog() {
    const queryClient = useQueryClient();
    const [open, setOpen] = useQueryState(
        "sankey-export",
        parseAsBoolean.withDefault(false).withOptions({ history: "push" }),
    );

    const [month, setMonth] = useLocalStorage({
        key: "sankey-export-month",
        defaultValue: "",
    });
    const [year, setYear] = useLocalStorage({
        key: "sankey-export-year",
        defaultValue: "",
    });
    const [incomeSources, setIncomeSources] = useLocalStorage<IncomeSource[]>({
        key: "sankey-export-income-sources",
        defaultValue: [{ id: nanoid(12), name: "", amount: "" }],
    });
    const [savingsTargets, setSavingsTargets] = useLocalStorage<
        SavingsTarget[]
    >({
        key: "sankey-export-savings-targets",
        defaultValue: [{ id: nanoid(12), name: "", amount: "" }],
    });

    function addIncomeSource() {
        setIncomeSources([
            ...incomeSources,
            { id: nanoid(12), name: "", amount: "" },
        ]);
    }

    function removeIncomeSource(id: string) {
        if (incomeSources.length > 1) {
            setIncomeSources(incomeSources.filter((s) => s.id !== id));
        }
    }

    function updateIncomeSource(
        id: string,
        field: "name" | "amount",
        value: string,
    ) {
        setIncomeSources(
            incomeSources.map((s) =>
                s.id === id ? { ...s, [field]: value } : s,
            ),
        );
    }

    function addSavingsTarget() {
        setSavingsTargets([
            ...savingsTargets,
            { id: nanoid(12), name: "", amount: "" },
        ]);
    }

    function removeSavingsTarget(id: string) {
        if (savingsTargets.length > 1) {
            setSavingsTargets(savingsTargets.filter((s) => s.id !== id));
        }
    }

    function updateSavingsTarget(
        id: string,
        field: "name" | "amount",
        value: string,
    ) {
        setSavingsTargets(
            savingsTargets.map((s) =>
                s.id === id ? { ...s, [field]: value } : s,
            ),
        );
    }

    async function generateSankeyCSV() {
        const monthNum = parseInt(month);
        const yearNum = parseInt(year);

        if (!monthNum || !yearNum || monthNum < 1 || monthNum > 12) {
            toast.error("Please enter a valid month (1-12) and year");
            return;
        }

        const startDate = startOfMonth(new Date(yearNum, monthNum - 1));
        const endDate = endOfMonth(startDate);

        let transactions, categories, fixedCosts;
        try {
            [transactions, categories, fixedCosts] = await Promise.all([
                queryClient.fetchQuery(
                    transactionsQuery({
                        from: startDate.getTime(),
                        to: endDate.getTime(),
                        excludeExceptional: true,
                    }),
                ),
                queryClient.fetchQuery(categoriesQuery),
                queryClient.fetchQuery(fixedCostsQuery),
            ]);
        } catch {
            toast.error("Could not load the data for the export");
            return;
        }

        const csv = buildSankeyCSV({
            monthIndex: parseInt(month) - 1,
            year: parseInt(year),
            incomeSources: incomeSources.map((s) => ({
                name: s.name,
                amount: parseFloat(s.amount) || 0,
            })),
            fixedCosts: fixedCosts
                .filter((it) => isRunningOn(it, endDate))
                .map((it) => ({
                    name: it.name,
                    amount: toFixedCost(it, []).monthlyAmount,
                })),
            savingsTargets: savingsTargets.map((s) => ({
                name: s.name,
                amount: parseFloat(s.amount) || 0,
            })),
            transactions: transactions.map((it) => ({
                name: it.name,
                category_id: it.categoryId,
                amount: it.kind === "income" ? -it.amount : it.amount,
            })),
            categories,
        });

        downloadSankeyCSV(csv, `sankey-${year}-${month.padStart(2, "0")}.md`);

        void setOpen(false);
    }

    return (
        <AlertDialog
            open={open}
            onOpenChange={(newVal) => void setOpen(newVal)}
        >
            <AlertDialogTrigger asChild>
                <Button variant="filledTonal">
                    <TableOfContents />
                    Summarize
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-h-[90vh] overflow-y-auto">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Export Month as Sankey Diagram
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Enter the month and year to export, along with income
                        sources and fixed costs.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label
                                className={`text-body-small
                                    text-on-surface-variant mb-1 block`}
                                htmlFor="month"
                            >
                                Month (1-12)
                            </Label>
                            <Input
                                id="month"
                                type="number"
                                min="1"
                                max="12"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                placeholder="e.g., 11"
                                required
                            />
                        </div>
                        <div>
                            <Label
                                className={`text-body-small
                                    text-on-surface-variant mb-1 block`}
                                htmlFor="year"
                            >
                                Year
                            </Label>
                            <Input
                                id="year"
                                type="number"
                                min="2000"
                                max="2100"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                placeholder="e.g., 2025"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <Label className={"text-title-small"}>
                                Income Sources
                            </Label>
                            <Button
                                variant="text"
                                size="sm"
                                onClick={addIncomeSource}
                            >
                                <Plus />
                                Add
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {incomeSources.map((source) => (
                                <div
                                    key={source.id}
                                    className="flex items-center gap-2"
                                >
                                    <Input
                                        placeholder="Name (e.g., job)"
                                        value={source.name}
                                        onChange={(e) =>
                                            updateIncomeSource(
                                                source.id,
                                                "name",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Amount"
                                        value={source.amount}
                                        onChange={(e) =>
                                            updateIncomeSource(
                                                source.id,
                                                "amount",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        aria-label="Remove"
                                        onClick={() =>
                                            removeIncomeSource(source.id)
                                        }
                                        disabled={incomeSources.length === 1}
                                    >
                                        <Trash2 />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <Label className={"text-title-small"}>
                                Savings Targets
                            </Label>
                            <Button
                                variant="text"
                                size="sm"
                                onClick={addSavingsTarget}
                            >
                                <Plus />
                                Add
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {savingsTargets.map((target) => (
                                <div
                                    key={target.id}
                                    className="flex items-center gap-2"
                                >
                                    <Input
                                        placeholder="Name (e.g., bitcoin)"
                                        value={target.name}
                                        onChange={(e) =>
                                            updateSavingsTarget(
                                                target.id,
                                                "name",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Amount"
                                        value={target.amount}
                                        onChange={(e) =>
                                            updateSavingsTarget(
                                                target.id,
                                                "amount",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        aria-label="Remove"
                                        onClick={() =>
                                            removeSavingsTarget(target.id)
                                        }
                                        disabled={savingsTargets.length === 1}
                                    >
                                        <Trash2 />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => void generateSankeyCSV()}>
                        Export
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
