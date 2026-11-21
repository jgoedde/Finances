import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Toggle as TogglePrimitive } from "radix-ui";
import CheckIcon from "~icons/material-symbols/check-rounded";
import CloseIcon from "~icons/material-symbols/close-rounded";
import { useRipple } from "#/hooks/use-ripple.ts";
import { cn } from "#/lib/cn.ts";
import * as haptics from "#/lib/haptics.ts";
import type { IconComponent } from "#/lib/icon.ts";

// MD3 chips (https://m3.material.io/components/chips/specs): 32dp high, 8dp
// corners, label large, 18dp icons, 8dp between icon and label. Padding is
// 16dp, or 8dp on the side of an icon. Outlined chips have a 1dp
// outline-variant border, elevated ones a surface-container-low container at
// level 1. Selected filter and input chips fill with secondary-container.
const chipVariants = cva(
    [
        "ripple-container state-layer focus-ring inline-flex h-8 w-fit shrink-0 cursor-pointer items-center justify-center gap-2 rounded-sm px-4 text-label-large whitespace-nowrap outline-none select-none",
        "transition-[background-color,border-color,box-shadow,color] duration-200 ease-standard",
        "[&_svg]:pointer-events-none [&_svg]:size-[18px] [&_svg]:shrink-0",
        "disabled:pointer-events-none disabled:text-on-surface/38 disabled:[&_svg]:text-on-surface/38",
        "aria-disabled:pointer-events-none aria-disabled:text-on-surface/38 aria-disabled:[&_svg]:text-on-surface/38",
    ],
    {
        variants: {
            type: {
                assist: "text-on-surface [&_svg]:text-primary",
                suggestion: "text-on-surface-variant [&_svg]:text-primary",
                filter: [
                    "text-on-surface-variant [&_svg]:text-on-surface-variant",
                    "aria-pressed:bg-secondary-container aria-pressed:text-on-secondary-container aria-pressed:[&_svg]:text-on-secondary-container",
                ],
                input: [
                    "text-on-surface-variant [&_svg]:text-on-surface-variant",
                    "data-selected:bg-secondary-container data-selected:text-on-secondary-container data-selected:[&_svg]:text-on-secondary-container",
                ],
            },
            elevated: {
                false: [
                    "border border-outline-variant",
                    "disabled:border-on-surface/12 aria-disabled:border-on-surface/12",
                    // Selected chips drop the outline and lift on hover.
                    "aria-pressed:border-transparent data-selected:border-transparent",
                    "hover:aria-pressed:shadow-elevation-1 hover:data-selected:shadow-elevation-1",
                ],
                true: [
                    "bg-surface-container-low shadow-elevation-1 hover:shadow-elevation-2",
                    "disabled:bg-on-surface/12 disabled:shadow-none aria-disabled:bg-on-surface/12 aria-disabled:shadow-none",
                ],
            },
            leading: {
                false: "",
                true: "pl-2",
            },
            trailing: {
                false: "",
                true: "pr-2",
            },
        },
        defaultVariants: {
            elevated: false,
            leading: false,
            trailing: false,
        },
    },
);

const RIPPLE_COLORS = {
    assist: "bg-on-surface/40",
    suggestion: "bg-on-surface-variant/40",
    filter: "bg-on-surface-variant/40",
    selected: "bg-on-secondary-container/40",
} as const;

interface ChipIconsProps {
    /**
     * Leading icon.
     */
    icon?: IconComponent;

    /**
     * Trailing icon, e.g. `arrow_drop_down` for a chip that opens a menu.
     */
    trailingIcon?: IconComponent;
}

type ActionChipProps = Omit<React.ComponentProps<"button">, "type"> &
    Pick<VariantProps<typeof chipVariants>, "elevated"> &
    ChipIconsProps;

function ActionChip({
    kind,
    className,
    elevated,
    icon: Icon,
    trailingIcon: TrailingIcon,
    children,
    onClick,
    onTouchStart,
    onTouchEnd,
    ...props
}: ActionChipProps & { kind: "assist" | "suggestion" }) {
    const ripple = useRipple();

    return (
        <button
            data-slot={`${kind}-chip`}
            type={"button"}
            data-ripple-color={RIPPLE_COLORS[kind]}
            className={cn(
                chipVariants({
                    type: kind,
                    elevated,
                    leading: Icon !== undefined,
                    trailing: TrailingIcon !== undefined,
                }),
                className,
            )}
            onClick={(event) => {
                ripple.onClick(event);
                onClick?.(event);
            }}
            onTouchStart={(event) => {
                ripple.onTouchStart(event);
                onTouchStart?.(event);
            }}
            onTouchEnd={(event) => {
                ripple.onTouchEnd();
                onTouchEnd?.(event);
            }}
            {...props}
        >
            {Icon && <Icon aria-hidden />}
            {children}
            {TrailingIcon && <TrailingIcon aria-hidden />}
        </button>
    );
}

/**
 * An MD3 assist chip: a smart or automated action related to the content,
 * like "add to calendar". The leading icon is tinted primary.
 */
function AssistChip(props: ActionChipProps) {
    return <ActionChip kind={"assist"} {...props} />;
}

/**
 * An MD3 suggestion chip: a dynamically generated suggestion, like a reply
 * or a value to fill in. Usually text only.
 */
function SuggestionChip(props: ActionChipProps) {
    return <ActionChip kind={"suggestion"} {...props} />;
}

type FilterChipProps = Omit<
    React.ComponentProps<typeof TogglePrimitive.Root>,
    "pressed" | "defaultPressed" | "onPressedChange" | "asChild"
> &
    Pick<VariantProps<typeof chipVariants>, "elevated"> &
    ChipIconsProps & {
        selected: boolean;

        /**
         * Called when the unselected chip is tapped.
         */
        onSelect: () => void;

        /**
         * Called when the selected chip is tapped. Without it, tapping the
         * selected chip does nothing (single choice).
         */
        onDeselect?: () => void;
    };

/**
 * An MD3 filter chip, built on Radix Toggle (`aria-pressed`). A selected chip
 * fills with secondary-container and leads with a check mark in place of its
 * icon. Ticks when a tap changes the selection, not when it leaves the
 * selection as it is.
 *
 * Restyle the selected state with `aria-pressed:` classes (the state also
 * holds when a Radix trigger wrapping the chip overrides `data-state`).
 */
function FilterChip({
    className,
    elevated,
    selected,
    onSelect,
    onDeselect,
    icon,
    trailingIcon: TrailingIcon,
    children,
    onClick,
    onTouchStart,
    onTouchEnd,
    ...props
}: FilterChipProps) {
    const ripple = useRipple();
    const Icon = selected ? CheckIcon : icon;

    return (
        <TogglePrimitive.Root
            data-slot={"filter-chip"}
            data-ripple-color={
                selected ? RIPPLE_COLORS.selected : RIPPLE_COLORS.filter
            }
            className={cn(
                chipVariants({
                    type: "filter",
                    elevated,
                    leading: Icon !== undefined,
                    trailing: TrailingIcon !== undefined,
                }),
                className,
            )}
            pressed={selected}
            onPressedChange={(pressed) => {
                const handler = pressed ? onSelect : onDeselect;
                if (handler) {
                    haptics.tick();
                    handler();
                }
            }}
            onClick={(event) => {
                ripple.onClick(event);
                onClick?.(event);
            }}
            onTouchStart={(event) => {
                ripple.onTouchStart(event);
                onTouchStart?.(event);
            }}
            onTouchEnd={(event) => {
                ripple.onTouchEnd();
                onTouchEnd?.(event);
            }}
            {...props}
        >
            {Icon && <Icon aria-hidden />}
            {children}
            {TrailingIcon && <TrailingIcon aria-hidden />}
        </TogglePrimitive.Root>
    );
}

type InputChipProps = Omit<
    React.ComponentProps<"span">,
    "onClick" | "children"
> & {
    label: React.ReactNode;

    /**
     * Accessible name of the remove button, e.g. "Remove Anna".
     */
    removeLabel: string;
    onRemove: () => void;

    /**
     * Called when the chip itself is tapped (to edit it). Without it, only
     * the remove button is interactive.
     */
    onClick?: () => void;
    selected?: boolean;
    disabled?: boolean;
    icon?: IconComponent;

    /**
     * A 24dp avatar (an image or initials) in place of the icon.
     */
    avatar?: React.ReactNode;
};

/**
 * An MD3 input chip: a piece of information the user entered, like a tag or
 * a recipient. Its two actions are separate tab stops: the chip itself
 * (`onClick`) and the trailing remove button. Backspace or Delete on the
 * chip removes it too.
 */
function InputChip({
    className,
    label,
    removeLabel,
    onRemove,
    onClick,
    selected = false,
    disabled = false,
    icon: Icon,
    avatar,
    ...props
}: InputChipProps) {
    const primaryRipple = useRipple();
    const removeRipple = useRipple();
    // Leading padding: 4dp before an avatar, 8dp before an icon, else 12dp.
    const leadingPadding = avatar ? "pl-1" : Icon ? "pl-2" : "pl-3";
    const rippleColor = selected
        ? RIPPLE_COLORS.selected
        : RIPPLE_COLORS.filter;

    function remove() {
        haptics.tick();
        onRemove();
    }

    const content = (
        <>
            {avatar ? (
                <span
                    data-slot={"input-chip-avatar"}
                    className={
                        "flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full [&>img]:size-full [&>img]:object-cover"
                    }
                >
                    {avatar}
                </span>
            ) : (
                Icon && <Icon aria-hidden />
            )}
            {label}
        </>
    );

    return (
        <span
            data-slot={"input-chip"}
            data-selected={selected || undefined}
            aria-disabled={disabled || undefined}
            className={cn(
                chipVariants({ type: "input", elevated: false }),
                // The actions carry the padding, state layers and ripples.
                "gap-0 p-0 before:hidden",
                className,
            )}
            {...props}
        >
            {onClick ? (
                <button
                    type={"button"}
                    disabled={disabled}
                    data-ripple-color={rippleColor}
                    className={cn(
                        "ripple-container state-layer focus-ring flex h-full cursor-pointer items-center gap-2 rounded-l-sm pr-2 outline-none",
                        leadingPadding,
                    )}
                    {...primaryRipple}
                    onClick={(event) => {
                        primaryRipple.onClick(event);
                        onClick();
                    }}
                    onKeyDown={(event) => {
                        if (
                            event.key === "Backspace" ||
                            event.key === "Delete"
                        ) {
                            event.preventDefault();
                            remove();
                        }
                    }}
                >
                    {content}
                </button>
            ) : (
                <span
                    className={cn(
                        "flex h-full items-center gap-2 pr-2",
                        leadingPadding,
                    )}
                >
                    {content}
                </span>
            )}
            <button
                type={"button"}
                disabled={disabled}
                aria-label={removeLabel}
                data-ripple-color={rippleColor}
                className={
                    "ripple-container state-layer focus-ring mr-1 flex size-6 cursor-pointer items-center justify-center rounded-full outline-none"
                }
                {...removeRipple}
                onClick={(event) => {
                    removeRipple.onClick(event);
                    remove();
                }}
            >
                <CloseIcon aria-hidden />
            </button>
        </span>
    );
}

export { AssistChip, FilterChip, InputChip, SuggestionChip };
