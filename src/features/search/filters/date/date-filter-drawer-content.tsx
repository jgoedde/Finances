import { DrawerClose } from "@/components/ui/drawer.tsx";
import { X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
    type DateFilterOption,
    getDateFilterStr,
} from "@/features/search/filters/date/date-filter.ts";

interface Props {
    dateFilterOption: DateFilterOption;
    setDateFilterOption: (option: DateFilterOption) => void;
    closeDrawer: VoidFunction;
}

export function DateFilterDrawerContent({
    setDateFilterOption,
    dateFilterOption,
    closeDrawer,
}: Props) {
    return (
        <div className={"mx-4"}>
            <div className={"mb-8 flex gap-x-4"}>
                <DrawerClose asChild>
                    <div>
                        <X />
                    </div>
                </DrawerClose>
                <div className={"font-medium"}>Datum</div>
            </div>
            <RadioGroup
                defaultValue={dateFilterOption}
                onValueChange={(e) => {
                    setDateFilterOption(e as typeof dateFilterOption);
                    closeDrawer();
                }}
                className={"mb-6"}
            >
                <div className="mb-3 flex items-center gap-5">
                    <RadioGroupItem value="any" id="any" />
                    <Label htmlFor="any">{getDateFilterStr("any")}</Label>
                </div>
                <div className="mb-3 flex items-center gap-5">
                    <RadioGroupItem value="oneWeek" id="oneWeek" />
                    <Label htmlFor="oneWeek">
                        {getDateFilterStr("oneWeek")}
                    </Label>
                </div>
                <div className="mb-3 flex items-center gap-5">
                    <RadioGroupItem value="oneMonth" id="oneMonth" />
                    <Label htmlFor="oneMonth">
                        {getDateFilterStr("oneMonth")}
                    </Label>
                </div>

                <div className="mb-3 flex items-center gap-5">
                    <RadioGroupItem value="halfYear" id="halfYear" />
                    <Label htmlFor="halfYear">
                        {getDateFilterStr("halfYear")}
                    </Label>
                </div>

                <div className="mb-3 flex items-center gap-5">
                    <RadioGroupItem value="oneYear" id="oneYear" />
                    <Label htmlFor="oneYear">
                        {getDateFilterStr("oneYear")}
                    </Label>
                </div>
            </RadioGroup>
            <button className={"text-primary mb-4 text-sm"}>
                Benutzerdefinierter Zeitraum
            </button>
        </div>
    );
}
