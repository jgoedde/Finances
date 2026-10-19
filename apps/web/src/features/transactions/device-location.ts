import { useEffect, useState } from "react";
import { useLocalStorage } from "@mantine/hooks";
import type { Transaction } from "@finances/shared";

// Whether new transactions save where the device was. Per device in
// localStorage, off by default.
function useSaveLocationSetting() {
    return useLocalStorage({
        key: "finances-save-location",
        defaultValue: false,
        getInitialValueInEffect: false,
    });
}

/**
 * Asks for the browser permission; `false` if it is denied or the browser
 * has no geolocation.
 */
function requestPermission(): Promise<boolean> {
    if (!("geolocation" in navigator)) {
        return Promise.resolve(false);
    }
    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
            () => resolve(true),
            // Only a denial means no; a position that's unavailable right
            // now may be available when capturing.
            (error) => resolve(error.code !== error.PERMISSION_DENIED),
            { maximumAge: Infinity },
        );
    });
}

/**
 * Whether new transactions save the location, and a setter. Turning it on
 * asks for the browser permission and resolves to `false` (leaving it off)
 * if that is denied.
 */
export function useSaveLocation() {
    const [enabled, setEnabled] = useSaveLocationSetting();

    async function changeEnabled(next: boolean): Promise<boolean> {
        const allowed = !next || (await requestPermission());
        setEnabled(next && allowed);
        return allowed;
    }

    return [enabled, changeEnabled] as const;
}

/**
 * The device's current location while the component is mounted, if saving
 * the location is on; `null` until a position is known or if it fails.
 */
export function useCurrentLocation(): Transaction["location"] {
    const [enabled] = useSaveLocationSetting();
    const [location, setLocation] = useState<Transaction["location"]>(null);

    useEffect(() => {
        if (!enabled || !("geolocation" in navigator)) {
            return;
        }
        // Keeps refining while the form is open; failures are silent.
        const watchId = navigator.geolocation.watchPosition(
            ({ coords }) =>
                setLocation({
                    lat: coords.latitude,
                    lng: coords.longitude,
                    accuracy: coords.accuracy,
                }),
            () => undefined,
            { enableHighAccuracy: true, maximumAge: 60_000 },
        );
        return () => navigator.geolocation.clearWatch(watchId);
    }, [enabled]);

    return location;
}
