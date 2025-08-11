import { DynamicIcon } from "lucide-react/dynamic";
import { ChevronRight } from "lucide-react";
import { useRipple } from "@/hooks/use-ripple.ts";
import { convertHexToTonal } from "@/lib/color-utils.ts";
import { useColorScheme } from "@mantine/hooks";
import { cn } from "@/lib/utils.ts";
import { useNavigate } from "@tanstack/react-router";
import type { Expense } from "@/persistence/types.ts";
import { categories } from "@/components/expenses/editor/categories.ts";

// TODO: All of this

export const ExpenseListItem = ({
    transaction: { id, name, description, amount },
    // transaction: { id, name, description, category, amountFormatted, amount }, TODO
}: {
    transaction: Expense;
}) => {
    const rippleHandlers = useRipple();
    const theme = useColorScheme();

    const supportingText = "todo";
    console.log(description, "description");
    // description?.trim() !== "" ? description : category.name;

    const navigate = useNavigate();

    function onEditButtonClick() {
        setTimeout(() => {
            void navigate({ to: "/edit/$id", params: { id } });
        }, 150);
    }

    const tonal = convertHexToTonal("#000");
    const backgroundColor =
        theme === "dark" ? tonal.dark.container : tonal.light.container;

    const textColor =
        theme === "dark" ? tonal.dark.onContainer : tonal.light.onContainer;

    return (
        <div
            className={
                "ripple-container flex w-full flex-row items-center gap-x-3 rounded-md py-1.5"
            }
            data-ripple-color={"bg-on-surface/10"}
            {...rippleHandlers}
        >
            <div
                className={
                    "text-on-surface-variant flex size-10 min-w-8 shrink-0 items-center justify-center rounded-full"
                }
                style={{
                    backgroundColor,
                }}
            >
                <DynamicIcon
                    name={categories[0].icon} // TODO
                    className={"size-7"}
                    style={{
                        color: textColor,
                    }}
                />
            </div>
            <div className={"flex flex-1 flex-col"}>
                <div className={"text-on-surface font-medium"}>
                    <button
                        type={"button"}
                        onClick={() => onEditButtonClick()}
                        className={"inline-flex items-center gap-x-1"}
                    >
                        {name}{" "}
                        <ChevronRight className={"text-outline size-4"} />
                    </button>
                </div>
                <div
                    className={
                        "text-on-surface-variant line-clamp-2 text-sm/5 break-all"
                    }
                >
                    {supportingText}
                </div>
            </div>
            <div
                className={cn(
                    "flex items-center gap-x-2 justify-self-end font-medium",
                    amount < 0 && "text-[#3FFF68]",
                )}
            >
                {amount < 0 ? (
                    <div>+{"-12€".split("-")[1]}</div>
                ) : (
                    <div>{"12€"}</div>
                )}
            </div>
        </div>
    );
};
