import { m } from "#/paraglide/messages.js";

/**
 * The app's name, version (linking to the releases) and build mode.
 */
export function AppVersion() {
    return (
        <p
            data-full-width
            className={`py-4 text-center text-body-small
                text-on-surface-variant`}
        >
            {m.app_name()}{" "}
            <a
                className={"text-primary underline-offset-4 hover:underline"}
                href="https://github.com/jgoedde/Finances/releases"
            >
                v{__APP_VERSION__}
            </a>{" "}
            · {import.meta.env.MODE}
        </p>
    );
}
