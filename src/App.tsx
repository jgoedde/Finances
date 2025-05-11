import { Route, Switch, useLocation } from "wouter";
import { ExpensesPage } from "@/components/expenses/expenses-page.tsx";
import NewExpense from "@/components/new-expense/new-expense.tsx";
import { UnlockPage } from "@/components/unlock/unlock-page.tsx";
import { useEncryption } from "@/components/use-encryption.ts";
import { useEffect } from "react";

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
            <Route path="/new" component={NewExpense} />
            <Route path={"/unlock"} component={UnlockPage} />

            {/* Default route in a switch */}
            <Route>404: No such page!</Route>
        </Switch>
    );
}
