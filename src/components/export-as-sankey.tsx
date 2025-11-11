import { useState } from "react";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { expensesRepository } from "@/persistence/repository";
import { useEncryption } from "@/components/use-encryption";
import { Download, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { endOfMonth, startOfMonth } from "date-fns";
import { buildSankeyCSV, downloadSankeyCSV } from "@/lib/sankey-csv-utils.ts";

interface IncomeSource {
    id: string;
    name: string;
    amount: string;
}

interface FixedCost {
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
    const { key } = useEncryption();

    const [open, setOpen] = useState(false);

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
        defaultValue: [{ id: crypto.randomUUID(), name: "", amount: "" }],
    });
    const [fixedCosts, setFixedCosts] = useLocalStorage<FixedCost[]>({
        key: "sankey-export-fixed-costs",
        defaultValue: [{ id: crypto.randomUUID(), name: "", amount: "" }],
    });
    const [savingsTargets, setSavingsTargets] = useLocalStorage<
        SavingsTarget[]
    >({
        key: "sankey-export-savings-targets",
        defaultValue: [{ id: crypto.randomUUID(), name: "", amount: "" }],
    });

    function addIncomeSource() {
        setIncomeSources([
            ...incomeSources,
            { id: crypto.randomUUID(), name: "", amount: "" },
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

    function addFixedCost() {
        setFixedCosts([
            ...fixedCosts,
            { id: crypto.randomUUID(), name: "", amount: "" },
        ]);
    }

    function removeFixedCost(id: string) {
        if (fixedCosts.length > 1) {
            setFixedCosts(fixedCosts.filter((c) => c.id !== id));
        }
    }

    function updateFixedCost(
        id: string,
        field: "name" | "amount",
        value: string,
    ) {
        setFixedCosts(
            fixedCosts.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
        );
    }

    function addSavingsTarget() {
        setSavingsTargets([
            ...savingsTargets,
            { id: crypto.randomUUID(), name: "", amount: "" },
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

    function generateSankeyCSV() {
        if (!key) {
            toast.error("No encryption key available");
            return;
        }

        const monthNum = parseInt(month);
        const yearNum = parseInt(year);

        if (!monthNum || !yearNum || monthNum < 1 || monthNum > 12) {
            toast.error("Please enter a valid month (1-12) and year");
            return;
        }

        const startDate = startOfMonth(new Date(yearNum, monthNum - 1));
        const endDate = endOfMonth(startDate);

        const expenses = expensesRepository.getByTimeRange(
            startDate.getTime(),
            endDate.getTime(),
            key,
            undefined,
            false,
            true,
        );

        const csv = buildSankeyCSV({
            monthIndex: parseInt(month) - 1,
            year: parseInt(year),
            incomeSources: incomeSources.map((s) => ({
                name: s.name,
                amount: parseFloat(s.amount) || 0,
            })),
            fixedCosts: fixedCosts.map((c) => ({
                name: c.name,
                amount: parseFloat(c.amount) || 0,
            })),
            savingsTargets: savingsTargets.map((s) => ({
                name: s.name,
                amount: parseFloat(s.amount) || 0,
            })),
            transactions: expenses,
        });

        downloadSankeyCSV(csv, `sankey-${year}-${month.padStart(2, "0")}.md`);

        setOpen(false);
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="outline" size={"sm"}>
                    <Download />
                    Export Sankey
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
                            <Label className={"block"} htmlFor="month">
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
                                variant={"md3"}
                                required
                            />
                        </div>
                        <div>
                            <Label className={"block"} htmlFor="year">
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
                                variant={"md3"}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <Label>Income Sources</Label>
                            <Button
                                variant="ghost"
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
                                        variant={"md3"}
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
                                        variant={"md3"}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
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
                            <Label>Fixed Costs</Label>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={addFixedCost}
                            >
                                <Plus />
                                Add
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {fixedCosts.map((cost) => (
                                <div
                                    key={cost.id}
                                    className="flex items-center gap-2"
                                >
                                    <Input
                                        placeholder="Name (e.g., internet)"
                                        value={cost.name}
                                        onChange={(e) =>
                                            updateFixedCost(
                                                cost.id,
                                                "name",
                                                e.target.value,
                                            )
                                        }
                                        variant={"md3"}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Amount"
                                        value={cost.amount}
                                        onChange={(e) =>
                                            updateFixedCost(
                                                cost.id,
                                                "amount",
                                                e.target.value,
                                            )
                                        }
                                        variant={"md3"}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeFixedCost(cost.id)}
                                        disabled={fixedCosts.length === 1}
                                    >
                                        <Trash2 />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <Label>Savings Targets</Label>
                            <Button
                                variant="ghost"
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
                                        variant={"md3"}
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
                                        variant={"md3"}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
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
                    <AlertDialogAction onClick={generateSankeyCSV}>
                        Export
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
