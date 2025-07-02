import { Route, Switch, useLocation } from "wouter";
import { ExpensesPage } from "@/components/expenses/expenses-page.tsx";
import { UnlockPage } from "@/components/unlock/unlock-page.tsx";
import { useEncryption } from "@/components/use-encryption.ts";
import { EditExpensePage } from "@/components/expenses/editor/edit-expense-page.tsx";
import { ExpenseDetailPage } from "@/components/expenses/editor/expense-detail-page.tsx";
import { SearchPage } from "@/components/search/search-page.tsx";

export default function App() {
    const { key } = useEncryption();
    const [, route] = useLocation();

    if (key === undefined) {
        route("/unlock");
    }

    return (
        <Switch>
            <Route path="/" component={ExpensesPage} />
            <Route path="/new">{() => <ExpenseDetailPage />}</Route>
            <Route path="/unlock" component={UnlockPage} />
            <Route path="/expenses/search" component={SearchPage} />
            <Route path="/edit/:id">
                {(params) => <EditExpensePage id={params.id} />}
            </Route>

            {/* Default route in a switch */}
            <Route>404: No such page!</Route>
        </Switch>
    );
}
