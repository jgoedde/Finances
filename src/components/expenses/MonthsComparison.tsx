import { useAppSelector } from "@/redux-hooks.ts";
import { selectPastMonthsExpenses } from "@/components/expenses/selectors.ts";
import { Calendar } from "@/components/ui/calendar.tsx";
import { formatEuro } from "@/lib/currency-utils.ts";
import { ChartNoAxesColumn, ShoppingBasket } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import { categories } from "@/components/expenses/editor/categories.ts";

export function MonthsComparison() {
    const something = useAppSelector((state) =>
        selectPastMonthsExpenses(state, 4),
    );

    console.log(something, "something");

    return (
        <div className="flex w-full snap-x snap-mandatory overflow-x-auto">
            <div className="bg-surface-container-lowest w-full flex-shrink-0 snap-start">
                <div className={"divide-outline-variant flex h-full divide-x"}>
                    <Calendar disableNavigation />
                    <div className={"flex h-full flex-col px-2 text-sm"}>
                        <h3
                            className={
                                "font-poppins mt-2 mb-auto text-lg font-semibold"
                            }
                        >
                            {formatEuro(384.25664)} ausgegeben
                        </h3>
                        <div className={"mt-2 flex flex-col gap-y-1"}>
                            <div className={"flex items-center gap-x-2"}>
                                <div>
                                    <ShoppingBasket className={"size-4"} />
                                </div>
                                <div>42 Ausgaben</div>
                            </div>
                            <div className={"flex items-center gap-x-2"}>
                                <div>
                                    <ChartNoAxesColumn className={"size-4"} />
                                </div>
                                <div>{formatEuro(12)} Ausgaben pro Tag</div>
                            </div>
                        </div>
                        <div className={"mb-2"}>
                            <h3 className={"mt-4 font-semibold"}>
                                Top Kategorien
                            </h3>
                            <div className={"mt-2 flex flex-col gap-y-1"}>
                                <div className={"flex items-center gap-x-2"}>
                                    <div>
                                        <DynamicIcon
                                            name={categories[0].icon}
                                            className={"size-4"}
                                            style={{
                                                color: categories[0].color,
                                            }}
                                        />
                                    </div>
                                    <div>{categories[0].name}</div>
                                </div>
                                <div className={"flex items-center gap-x-2"}>
                                    <div>
                                        <DynamicIcon
                                            name={categories[1].icon}
                                            className={"size-4"}
                                            style={{
                                                color: categories[1].color,
                                            }}
                                        />
                                    </div>
                                    <div>{categories[1].name}</div>
                                </div>
                                <div className={"flex items-center gap-x-2"}>
                                    <div>
                                        <DynamicIcon
                                            name={categories[2].icon}
                                            className={"size-4"}
                                            style={{
                                                color: categories[2].color,
                                            }}
                                        />
                                    </div>
                                    <div>{categories[2].name}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-surface-container-lowest w-full flex-shrink-0 snap-start">
                <Calendar disableNavigation />
            </div>
        </div>
    );
}
