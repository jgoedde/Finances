import type { PropsWithChildren } from "react";
import { getRouteApi, Link } from "@tanstack/react-router";

const transactionsRoute = getRouteApi("/_authed/_shell/_transactions");

interface CategoryLinkProps {
    categoryId: string;
    className: string;
}

/**
 * Selects the category in the transaction list, or clears the filter if
 * it's already selected. `data-active` while selected.
 */
export function CategoryLink({
    categoryId,
    className,
    children,
}: PropsWithChildren<CategoryLinkProps>) {
    const { category: selected } = transactionsRoute.useSearch();
    const isSelected = categoryId === selected;

    return (
        <Link
            to={"/transactions"}
            search={{
                category: isSelected ? undefined : categoryId,
                q: undefined,
                older: undefined,
            }}
            className={className}
            data-active={isSelected || undefined}
            aria-current={isSelected ? "page" : undefined}
        >
            {children}
        </Link>
    );
}
