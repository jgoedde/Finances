import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/expenses/search")({
    component: OutOfOrder,
});

function OutOfOrder() {
    return <>Out of order ATM</>;
}
