export function formatEuro(value: number | string): string {
    const numberValue = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
    }).format(numberValue);
}
