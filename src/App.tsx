import { Route, Switch, useLocation } from "wouter";
import { ExpensesPage } from "@/components/expenses/expenses-page.tsx";
import { UnlockPage } from "@/components/unlock/unlock-page.tsx";
import { useEncryption } from "@/components/use-encryption.ts";
import { useEffect } from "react";
import { EditExpense } from "@/components/expenses/editor/EditExpense.tsx";
import { NewExpense } from "@/components/new-expense/new-expense.tsx";
import { Reporting } from "@/components/reporting/reporting.tsx";

export default function App() {
    const { key } = useEncryption();
    const [, route] = useLocation();

    useEffect(() => {
        if (key === undefined) {
            route("/unlock");
        }
    }, [key, route]);

    return (
        <Switch>
            <Route path="/" component={ExpensesPage} />
            <Route path="/new">{() => <NewExpense />}</Route>
            <Route path="/unlock" component={UnlockPage} />
            <Route path="/reporting" component={Reporting} />
            <Route path="/edit/:id">
                {(params) => <EditExpense id={params.id} />}
            </Route>

            {/* Default route in a switch */}
            <Route>404: No such page!</Route>
        </Switch>
    );
}
