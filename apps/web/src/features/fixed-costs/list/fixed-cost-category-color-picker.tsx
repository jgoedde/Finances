import { useRef, useState } from "react";
import type { FixedCostCategory } from "@finances/shared";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "#/components/ui/drawer.tsx";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "#/components/ui/popover.tsx";
import { RadioGroup, RadioGroupSwatch } from "#/components/ui/radio-group.tsx";
import { useUpdateFixedCostCategory } from "#/features/fixed-costs/fixed-cost-queries.ts";
import { useIsOnline } from "#/features/sync/connectivity.ts";
import { OfflineHint } from "#/features/sync/offline-hint.tsx";
import { useIsMediumWindow } from "#/hooks/use-is-medium-window.ts";
import { cn } from "#/lib/cn.ts";
import { m } from "#/paraglide/messages.js";
import { paletteFromHue, toneStyle } from "#/utils/color.ts";

/**
 * One hue every 30°.
 */
const SWATCH_HUES = Array.from({ length: 12 }, (_, index) => index * 30);

interface FixedCostCategoryColorPickerProps {
    category: FixedCostCategory;

    /**
     * Whether the trigger shows the color; otherwise only an outline, for a
     * category without running fixed costs.
     */
    isColored: boolean;
}

/**
 * The color dot of a fixed cost category, which opens a choice of hues (a
 * popover on medium windows and wider, a bottom sheet otherwise). Clicking a
 * hue closes the choice; closing saves the chosen hue, so arrow keys can
 * browse first. Online-only.
 */
export function FixedCostCategoryColorPicker({
    category,
    isColored,
}: FixedCostCategoryColorPickerProps) {
    const [open, setOpen] = useState(false);
    const [draftHue, setDraftHue] = useState(category.hue);
    // The hue to save on close; `null` once saved, so closing twice (a click
    // closes, then the sheet reports its close) saves once.
    const pendingHue = useRef<number | null>(null);
    const isMediumWindow = useIsMediumWindow();
    const isOnline = useIsOnline();
    const updateCategory = useUpdateFixedCostCategory();
    const label = m.fixed_cost_category_color({ name: category.name });

    // The current hue stays choosable when it's off the grid.
    const hues = SWATCH_HUES.includes(category.hue)
        ? SWATCH_HUES
        : [...SWATCH_HUES, category.hue];

    function choose(hue: number) {
        setDraftHue(hue);
        pendingHue.current = hue;
    }

    function onOpenChange(isOpen: boolean) {
        setOpen(isOpen);
        if (isOpen) {
            setDraftHue(category.hue);
            pendingHue.current = null;
            return;
        }
        const hue = pendingHue.current;
        pendingHue.current = null;
        if (hue !== null && hue !== category.hue) {
            updateCategory.mutate({ id: category.id, update: { hue } });
        }
    }

    const swatches = (
        <RadioGroup
            aria-label={label}
            value={String(draftHue)}
            onValueChange={(value) => choose(Number(value))}
            className={"grid-cols-[repeat(auto-fill,2.5rem)] justify-center"}
        >
            {hues.map((hue) => (
                <RadioGroupSwatch
                    key={hue}
                    value={String(hue)}
                    aria-label={m.fixed_cost_category_hue({ hue })}
                    style={toneStyle(paletteFromHue(hue))}
                    onClick={() => {
                        choose(hue);
                        onOpenChange(false);
                    }}
                />
            ))}
        </RadioGroup>
    );

    const trigger = (
        <button
            type={"button"}
            aria-label={label}
            disabled={!isOnline}
            onClick={isMediumWindow ? undefined : () => onOpenChange(true)}
            className={`state-layer flex size-10 shrink-0 cursor-pointer
                items-center justify-center rounded-full focus-ring
                disabled:cursor-not-allowed`}
        >
            <span
                aria-hidden
                className={cn(
                    "size-3 rounded-full",
                    isColored ? "bg-(--tone) tone" : "border border-outline",
                )}
                style={
                    isColored
                        ? toneStyle(paletteFromHue(category.hue))
                        : undefined
                }
            />
        </button>
    );

    if (isMediumWindow) {
        return (
            <Popover open={open} onOpenChange={onOpenChange}>
                <OfflineHint active={!isOnline}>
                    <PopoverTrigger asChild>{trigger}</PopoverTrigger>
                </OfflineHint>
                <PopoverContent align={"start"}>{swatches}</PopoverContent>
            </Popover>
        );
    }

    return (
        <>
            <OfflineHint active={!isOnline}>{trigger}</OfflineHint>
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>{label}</DrawerTitle>
                    </DrawerHeader>
                    <div className={"px-4 pb-6"}>{swatches}</div>
                </DrawerContent>
            </Drawer>
        </>
    );
}
