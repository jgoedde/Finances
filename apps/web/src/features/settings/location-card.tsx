import { useState } from "react";
import { Card } from "#/components/ui/card.tsx";
import { Switch } from "#/components/ui/switch.tsx";
import { useSaveLocation } from "#/features/transactions/device-location.ts";
import { m } from "#/paraglide/messages.js";

export function LocationCard() {
    const [savesLocation, setSavesLocation] = useSaveLocation();
    const [isLocationDenied, setIsLocationDenied] = useState(false);

    async function handleSaveLocationChange(enabled: boolean) {
        setIsLocationDenied(!(await setSavesLocation(enabled)));
    }

    return (
        <Card className={"gap-3 p-4"}>
            <div className="flex items-center justify-between gap-4">
                <h2 className="font-brand text-title-large">
                    <label htmlFor={"save-location"}>
                        {m.settings_location()}
                    </label>
                </h2>
                <Switch
                    id={"save-location"}
                    checked={savesLocation}
                    onCheckedChange={(enabled) =>
                        void handleSaveLocationChange(enabled)
                    }
                />
            </div>
            <p className="text-body-medium text-on-surface-variant">
                {m.settings_location_description()}
            </p>
            {isLocationDenied && (
                <p role={"alert"} className="text-body-medium text-error">
                    {m.settings_location_denied()}
                </p>
            )}
        </Card>
    );
}
