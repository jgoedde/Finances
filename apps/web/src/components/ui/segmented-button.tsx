import { useRipple } from "@/hooks/use-ripple.ts";
import { cva } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { DynamicIcon } from "lucide-react/dynamic";
import { cn } from "@/lib/cn.ts";

// MD3 segmented button (https://m3.material.io/components/segmented-buttons/specs).
const segmentedButton = cva(
    "ripple-container state-layer focus-ring flex h-10 min-w-12 flex-1 cursor-pointer items-center justify-center gap-x-2 border border-outline px-3 text-label-large outline-none transition-colors duration-200 ease-standard",
    {
        variants: {
            selected: {
                true: "bg-secondary-container text-on-secondary-container",
                false: "text-on-surface",
            },
            position: {
                left: "rounded-l-full",
                middle: "-ml-px",
                right: "-ml-px rounded-r-full",
            },
        },
        defaultVariants: {
            selected: false,
            position: "left",
        },
    },
);

interface SegmentedButtonOption {
    label: ReactNode;
    value: string;
    icon?: ComponentProps<typeof DynamicIcon>["name"];
}

function getPosition(index: number, count: number) {
    if (index === 0) return "left";
    if (index === count - 1) return "right";
    return "middle";
}

export function SegmentedButton({
    options,
    value,
    onChange,
    className,
}: {
    options: SegmentedButtonOption[];
    value: string;
    onChange: (value: string) => void;
    className?: string;
}) {
    const ripple = useRipple();

    return (
        <div role={"group"} className={cn("flex", className)}>
            {options.map((option, idx) => {
                const isSelected = value === option.value;
                const icon = isSelected ? "check" : option.icon;

                return (
                    <button
                        key={option.value}
                        className={segmentedButton({
                            selected: isSelected,
                            position: getPosition(idx, options.length),
                        })}
                        aria-pressed={isSelected}
                        data-ripple-color={
                            isSelected
                                ? "bg-on-secondary-container/40"
                                : "bg-on-surface/40"
                        }
                        type="button"
                        {...ripple}
                        onClick={(e) => {
                            onChange(option.value);

                            ripple.onClick(e);
                        }}
                    >
                        {icon && (
                            <DynamicIcon
                                className={"size-[18px] shrink-0"}
                                name={icon}
                            />
                        )}
                        <span>{option.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
