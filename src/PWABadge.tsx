import { useRegisterSW } from "virtual:pwa-register/react";

function PWABadge() {
    // periodic sync is disabled, change the value to enable it, the period is in milliseconds
    // You can remove onRegisteredSW callback and registerPeriodicSync function
    const period = 0;

    const {
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegisteredSW(swUrl, r) {
            if (period <= 0) return;
            if (r?.active?.state === "activated") {
                registerPeriodicSync(period, swUrl, r);
            } else if (r?.installing) {
                r.installing.addEventListener("statechange", (e) => {
                    const sw = e.target as ServiceWorker;
                    if (sw.state === "activated")
                        registerPeriodicSync(period, swUrl, r);
                });
            }
        },
    });

    function close() {
        setNeedRefresh(false);
    }

    return (
        <div
            className="fixed bottom-4 left-1/2 z-50 w-11/12 -translate-x-1/2"
            role="alert"
            aria-labelledby="toast-message"
        >
            {needRefresh && (
                <div className="bg-surface-container-highest text-on-surface flex w-full max-w-md flex-col items-center gap-3 rounded-xl p-4 shadow-md sm:w-auto sm:flex-row dark:bg-neutral-800 dark:text-neutral-100">
                    <div className="flex-1 leading-snug" id="toast-message">
                        New content available, click on reload button to update.
                    </div>
                    <div className="ml-auto flex gap-2">
                        <button
                            type="button"
                            className="bg-secondary-container text-on-secondary-container hover:bg-secondary-container/90 focus:ring-secondary/50 min-h-[40px] rounded-full px-4 transition focus:ring-2"
                            onClick={() => close()}
                        >
                            Close
                        </button>
                        <button
                            type="button"
                            className="bg-primary text-primary-contrast hover:bg-primary/90 focus:ring-primary/50 min-h-[40px] rounded-full px-4 transition focus:ring-2"
                            onClick={() => updateServiceWorker(true)}
                        >
                            Reload
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PWABadge;

/**
 * This function will register a periodic sync check every hour, you can modify the interval as needed.
 */
function registerPeriodicSync(
    period: number,
    swUrl: string,
    r: ServiceWorkerRegistration,
) {
    if (period <= 0) return;

    setInterval(async () => {
        if ("onLine" in navigator && !navigator.onLine) return;

        const resp = await fetch(swUrl, {
            cache: "no-store",
            headers: {
                cache: "no-store",
                "cache-control": "no-cache",
            },
        });

        if (resp?.status === 200) await r.update();
    }, period);
}
