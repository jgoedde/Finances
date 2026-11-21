import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
    AssistChip,
    FilterChip,
    InputChip,
    SuggestionChip,
} from "#/components/ui/chip.tsx";
import * as haptics from "#/lib/haptics.ts";

describe("FilterChip", () => {
    it("selects an unselected chip", () => {
        const onSelect = vi.fn();
        render(
            <FilterChip selected={false} onSelect={onSelect}>
                Food
            </FilterChip>,
        );

        const chip = screen.getByRole("button", { name: "Food" });
        expect(chip).toHaveAttribute("aria-pressed", "false");
        fireEvent.click(chip);

        expect(onSelect).toHaveBeenCalledTimes(1);
        expect(haptics.tick).toHaveBeenCalled();
    });

    it("keeps a selected chip without onDeselect", () => {
        const onSelect = vi.fn();
        vi.mocked(haptics.tick).mockClear();
        render(
            <FilterChip selected onSelect={onSelect}>
                Food
            </FilterChip>,
        );

        const chip = screen.getByRole("button", { name: "Food" });
        expect(chip).toHaveAttribute("aria-pressed", "true");
        fireEvent.click(chip);

        expect(onSelect).not.toHaveBeenCalled();
        expect(haptics.tick).not.toHaveBeenCalled();
    });

    it("deselects a selected chip with onDeselect", () => {
        const onDeselect = vi.fn();
        render(
            <FilterChip selected onSelect={vi.fn()} onDeselect={onDeselect}>
                Food
            </FilterChip>,
        );

        fireEvent.click(screen.getByRole("button", { name: "Food" }));

        expect(onDeselect).toHaveBeenCalledTimes(1);
    });
});

describe("InputChip", () => {
    it("removes the chip with its remove button", () => {
        const onRemove = vi.fn();
        render(
            <InputChip
                label={"Anna"}
                removeLabel={"Remove Anna"}
                onRemove={onRemove}
            />,
        );

        fireEvent.click(screen.getByRole("button", { name: "Remove Anna" }));

        expect(onRemove).toHaveBeenCalledTimes(1);
    });

    it("edits on tap and removes on Backspace", () => {
        const onClick = vi.fn();
        const onRemove = vi.fn();
        render(
            <InputChip
                label={"Anna"}
                removeLabel={"Remove Anna"}
                onRemove={onRemove}
                onClick={onClick}
            />,
        );

        const chip = screen.getByRole("button", { name: "Anna" });
        fireEvent.click(chip);
        fireEvent.keyDown(chip, { key: "Backspace" });

        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onRemove).toHaveBeenCalledTimes(1);
    });

    it("disables both actions", () => {
        render(
            <InputChip
                label={"Anna"}
                removeLabel={"Remove Anna"}
                onRemove={vi.fn()}
                onClick={vi.fn()}
                disabled
            />,
        );

        for (const button of screen.getAllByRole("button")) {
            expect(button).toBeDisabled();
        }
    });
});

describe("action chips", () => {
    it("run their action", () => {
        const onAssist = vi.fn();
        const onSuggest = vi.fn();
        render(
            <>
                <AssistChip onClick={onAssist}>Add to calendar</AssistChip>
                <SuggestionChip elevated onClick={onSuggest}>
                    12,00 €
                </SuggestionChip>
            </>,
        );

        fireEvent.click(
            screen.getByRole("button", { name: "Add to calendar" }),
        );
        fireEvent.click(screen.getByRole("button", { name: "12,00 €" }));

        expect(onAssist).toHaveBeenCalledTimes(1);
        expect(onSuggest).toHaveBeenCalledTimes(1);
    });
});
