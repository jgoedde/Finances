import { useRipple } from "#/hooks/use-ripple.ts";
import { cva } from "class-variance-authority";
import type { ReactNode } from "react";
import CheckIcon from "~icons/material-symbols/check-rounded";
import { outlinedDisabledClassName } from "#/components/ui/disabled-styles.ts";
import { cn } from "#/lib/cn.ts";
import type { IconComponent } from "#/lib/icon.ts";
import * as haptics from "#/lib/haptics.ts";

// MD3 segmented button (https://m3.material.io/components/segmented-buttons/specs).
const segmentedButton = cva(
    [
        outlinedDisabledClassName,
        "ripple-container state-layer focus-ring flex h-10 min-w-12 flex-1 cursor-pointer items-center justify-center gap-x-2 border border-outline px-3 text-label-large outline-none transition-colors duration-200 ease-standard",
    ],
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
    icon?: IconComponent;
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
    disabled = false,
}: {
    options: SegmentedButtonOption[];
    value: string;
    onChange: (value: string) => void;
    className?: string;
    disabled?: boolean;
}) {
    const ripple = useRipple();

    return (
        <div role={"group"} className={cn("flex", className)}>
            {options.map((option, idx) => {
                const isSelected = value === option.value;
                const Icon = isSelected ? CheckIcon : option.icon;

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
                        disabled={disabled}
                        {...ripple}
                        onClick={(e) => {
                            if (!isSelected) {
                                haptics.tick();
                            }
                            onChange(option.value);

                            ripple.onClick(e);
                        }}
                    >
                        {Icon && <Icon className={"size-[18px] shrink-0"} />}
                        <span>{option.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
