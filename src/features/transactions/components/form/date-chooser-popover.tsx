import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { ClockFading } from "lucide-react";
import { Calendar } from "@/components/ui/calendar.tsx";
import { de } from "date-fns/locale";

type Props = {
    selected: Date;
    onSelect: (a?: Date) => void;
};

export function DateChooserPopover({ onSelect, selected }: Props) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className={"cursor-pointer"}>
                    <ClockFading className={"size-5"} />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto border-none p-0 shadow-lg">
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
