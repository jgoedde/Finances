import {
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "#/components/ui/drawer.tsx";
import { Button } from "#/components/ui/button.tsx";
import { RadioGroup, RadioGroupItem } from "#/components/ui/radio-group.tsx";
import { Label } from "#/components/ui/label.tsx";
import {
    DATE_FILTER_OPTIONS,
    type DateFilterOption,
    getDateFilterStr,
} from "#/features/search/filters/date/date-filter.ts";
import { m } from "#/paraglide/messages.js";

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
                <DrawerTitle>{m.period()}</DrawerTitle>
                <DrawerDescription className={"sr-only"}>
                    {m.period_choose_search()}
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
                {DATE_FILTER_OPTIONS.map((option) => (
                    <Label
                        key={option}
                        htmlFor={option}
                        className={`state-layer flex min-h-14 cursor-pointer
                        items-center gap-4 px-4 text-body-large text-on-surface`}
                    >
                        <RadioGroupItem value={option} id={option} />
                        {getDateFilterStr(option)}
                    </Label>
                ))}
            </RadioGroup>
            <Button variant={"text"} className={"m-4 self-start"}>
                {m.period_custom()}
            </Button>
        </>
    );
}
