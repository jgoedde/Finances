import { useState } from "react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import ImageSearchIcon from "~icons/material-symbols/image-search-rounded";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "#/components/ui/empty.tsx";
import { Field, FieldLabel } from "#/components/ui/field.tsx";
import { Input } from "#/components/ui/input.tsx";
import {
    RadioGroup,
    RadioGroupIconItem,
} from "#/components/ui/radio-group.tsx";
import { searchCategoryIcons } from "#/features/categories/category-style.ts";
import { m } from "#/paraglide/messages.js";

interface CategoryIconFieldProps {
    id: string;
    value: string;
    onChange: (iconName: string) => void;

    /**
     * The category's current icon, which stays choosable when it isn't in
     * the curated list.
     */
    initialIconName: string;
}

/**
 * The category's icon, searchable from the curated list.
 */
export function CategoryIconField({
    id,
    value,
    onChange,
    initialIconName,
}: CategoryIconFieldProps) {
    const [search, setSearch] = useState("");

    const icons = searchCategoryIcons(search).map((icon) => icon.name);
    if (search.trim() === "" && !icons.includes(initialIconName as IconName)) {
        icons.unshift(initialIconName as IconName);
    }

    return (
        <Field>
            <FieldLabel id={id}>{m.category_icon()}</FieldLabel>
            <Input
                type={"search"}
                aria-label={m.category_icon_search()}
                placeholder={m.category_icon_search()}
                value={search}
                autoComplete={"off"}
                onChange={(event) => setSearch(event.target.value)}
            />
            {icons.length > 0 ? (
                <RadioGroup
                    aria-labelledby={id}
                    value={value}
                    onValueChange={onChange}
                    className={"grid-cols-[repeat(auto-fill,3rem)] gap-1"}
                >
                    {icons.map((icon) => (
                        <RadioGroupIconItem
                            key={icon}
                            value={icon}
                            aria-label={icon}
                        >
                            <DynamicIcon name={icon} />
                        </RadioGroupIconItem>
                    ))}
                </RadioGroup>
            ) : (
                <Empty size={"compact"}>
                    <EmptyHeader>
                        <EmptyMedia>
                            <ImageSearchIcon />
                        </EmptyMedia>
                        <EmptyTitle>{m.category_icon_none()}</EmptyTitle>
                        <EmptyDescription>
                            {m.category_icon_none_hint()}
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            )}
        </Field>
    );
}
