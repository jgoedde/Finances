import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "#/components/ui/popover.tsx";
import { ClockFading } from "lucide-react";
import { Calendar } from "#/components/ui/calendar.tsx";
import { Button } from "#/components/ui/button.tsx";
import { m } from "#/paraglide/messages.js";

type Props = {
    selected: Date;
    onSelect: (a?: Date) => void;
};

export function DateChooserPopover({ onSelect, selected }: Props) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    type={"button"}
                    variant={"ghost"}
                    size={"icon"}
                    aria-label={m.transaction_choose_date()}
                >
                    <ClockFading />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={selected}
                    onSelect={onSelect}
                />
            </PopoverContent>
        </Popover>
    );
}
