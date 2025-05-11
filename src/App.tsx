import { Route, Switch } from "wouter";
import { HomePage } from "@/home-page.tsx";
import NewExpense from "@/new/page.tsx";

export default function App() {
    return (
        <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/new" component={NewExpense} />

            {/* Default route in a switch */}
            <Route>404: No such page!</Route>
        </Switch>
    );
}
