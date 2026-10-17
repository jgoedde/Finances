import {
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer.tsx";
import { Button } from "@/components/ui/button.tsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
    type DateFilterOption,
    getDateFilterStr,
} from "@/features/search/filters/date/date-filter.ts";

const OPTIONS: DateFilterOption[] = [
    "any",
    "oneWeek",
    "oneMonth",
    "halfYear",
    "oneYear",
];

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
        <>
            <DrawerHeader className={"pt-0 text-left"}>
                <DrawerTitle>Zeitraum</DrawerTitle>
                <DrawerDescription className={"sr-only"}>
                    Zeitraum für die Suche wählen
                </DrawerDescription>
            </DrawerHeader>
            <RadioGroup
                defaultValue={dateFilterOption}
                onValueChange={(e) => {
                    setDateFilterOption(e as typeof dateFilterOption);
                    closeDrawer();
                }}
                className={"gap-0"}
            >
                {OPTIONS.map((option) => (
                    <Label
                        key={option}
                        htmlFor={option}
                        className={`state-layer text-body-large text-on-surface
                        flex min-h-14 cursor-pointer items-center gap-4 px-4`}
                    >
                        <RadioGroupItem value={option} id={option} />
                        {getDateFilterStr(option)}
                    </Label>
                ))}
            </RadioGroup>
            <Button variant={"text"} className={"m-4 self-start"}>
                Benutzerdefinierter Zeitraum
            </Button>
        </>
    );
}
