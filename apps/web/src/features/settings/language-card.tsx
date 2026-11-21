import { Card } from "#/components/ui/card.tsx";
import { SegmentedButton } from "#/components/ui/segmented-button.tsx";
import { chooseLocale } from "#/i18n.ts";
import { m } from "#/paraglide/messages.js";
import { getLocale, type Locale, locales } from "#/paraglide/runtime.js";

/**
 * Each language in its own words.
 */
const LANGUAGE_NAMES = {
    de: "Deutsch",
    en: "English",
} as const satisfies Record<Locale, string>;

export function LanguageCard() {
    return (
        <Card className={"gap-3 p-4"}>
            <h2 className="font-brand text-title-large">
                {m.settings_language()}
            </h2>
            <p className="text-body-medium text-on-surface-variant">
                {m.settings_language_description()}
            </p>
            <SegmentedButton
                options={locales.map((locale) => ({
                    label: LANGUAGE_NAMES[locale],
                    value: locale,
                }))}
                value={getLocale()}
                onChange={(locale) => chooseLocale(locale as Locale)}
            />
        </Card>
    );
}
