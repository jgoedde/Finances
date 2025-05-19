import { Route, Switch, useLocation } from "wouter";
import { ExpensesPage } from "@/components/expenses/expenses-page.tsx";
import { UnlockPage } from "@/components/unlock/unlock-page.tsx";
import { useEncryption } from "@/components/use-encryption.ts";
import { useEffect } from "react";
import { EditExpensePage } from "@/components/expenses/editor/edit-expense-page.tsx";
import { ExpenseDetail } from "@/components/expenses/editor/expense-detail.tsx";
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
            <Route path="/new">{() => <ExpenseDetail />}</Route>
            <Route path="/unlock" component={UnlockPage} />
            <Route path="/reporting" component={Reporting} />
            <Route path="/edit/:id">
                {(params) => <EditExpensePage id={params.id} />}
            </Route>

            {/* Default route in a switch */}
            <Route>404: No such page!</Route>
        </Switch>
    );
}
