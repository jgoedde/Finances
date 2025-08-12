import { useRipple } from "@/hooks/use-ripple.ts";
import { cn } from "@/lib/utils.ts";
import { cva } from "class-variance-authority";
import type { ReactNode } from "react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";

const segmentedButton = cva(
    "ripple-container border-outline border py-2 outline-none flex items-center gap-x-2",
    {
        variants: {
            selected: {
                true: "bg-secondary-container text-on-secondary-container",
                false: "text-on-surface",
            },
            position: {
                left: "rounded-tl-full rounded-bl-full px-4",
                right: "rounded-tr-full rounded-br-full border-l-0 pr-4 pl-2",
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
    icon: IconName;
}

export function SegmentedButton({
    options,
    value,
    onChange,
}: {
    options: SegmentedButtonOption[];
    value: string;
    onChange: (value: string) => void;
}) {
    const ripple = useRipple();

    return (
        <div className={"flex"}>
            {options.map((option, idx) => (
                <button
                    key={option.value}
                    className={cn(
                        segmentedButton({
                            selected: value === option.value,
                            position: idx === 0 ? "left" : "right",
                        }),
                    )}
                    data-ripple-color={
                        value === option.value
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
                    <div className={"size-5"}>
                        <DynamicIcon
                            className={"size-full"}
                            name={
                                value === option.value ? "check" : option.icon
                            }
                        />
                    </div>
                    <div>{option.label}</div>
                </button>
            ))}
        </div>
    );
}
