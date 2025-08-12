import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef } from "react";
import { Input } from "@/components/ui/input.tsx";
import { useExpensesCount } from "@/components/expenses/use-expenses.ts";
import { PersistentDatabase } from "@/persistence/persistent-database.ts";

export const Route = createFileRoute("/blob")({
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const expensesCount = useExpensesCount();

    return (
        <div>
            <Input
                type={"file"}
                max={1}
                multiple={false}
                accept={".sqlite"}
                ref={fileInputRef}
                onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;

                    await PersistentDatabase.importFile(file);
                    void navigate({ to: "/setup" });
                }}
            />

            <div>{expensesCount} Geldbewegungen</div>
        </div>
    );
}
