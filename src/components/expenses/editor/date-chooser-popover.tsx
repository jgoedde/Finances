import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { ClockFading } from "lucide-react";
import { Calendar } from "@/components/ui/calendar.tsx";
import type { FC } from "react";

type Props = {
    selected: Date;
    onSelect: (a: Date | undefined) => void;
};

export const DateChooserPopover: FC<Props> = ({ onSelect, selected }) => (
    <Popover>
        <PopoverTrigger asChild>
            <button className={"cursor-pointer"}>
                <ClockFading className={"size-5"} />
            </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto border-none p-0 shadow-lg">
            <Calendar
                weekStartsOn={1}
                mode="single"
                selected={selected}
                onSelect={onSelect}
                initialFocus
            />
        </PopoverContent>
    </Popover>
);
