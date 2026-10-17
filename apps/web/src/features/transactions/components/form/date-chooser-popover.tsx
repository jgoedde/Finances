import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { ClockFading } from "lucide-react";
import { Calendar } from "@/components/ui/calendar.tsx";
import { de } from "date-fns/locale";
import { Button } from "@/components/ui/button.tsx";

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
                    aria-label={"Datum wählen"}
                >
                    <ClockFading />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    locale={de}
                    mode="single"
                    selected={selected}
                    onSelect={onSelect}
                />
            </PopoverContent>
        </Popover>
    );
}
