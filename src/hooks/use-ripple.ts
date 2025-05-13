import { useCallback, useRef } from "react";

export const useRipple = () => {
    const holdTimeout = useRef<number | null>(null);

    const triggerRipple = useCallback((e: React.MouseEvent | TouchEvent) => {
        const target = (e.target as HTMLElement)?.closest(
            ".ripple-container",
        ) as HTMLElement | null;
        if (!target) return;

        const rect = target.getBoundingClientRect();
        const ripple = document.createElement("span");

        const colorClass = target.dataset.rippleColor || "bg-white";
        ripple.className = `ripple ${colorClass}`;

        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;

        const clientX =
            "touches" in e
                ? e.touches[0].clientX
                : (e as React.MouseEvent).clientX;
        const clientY =
            "touches" in e
                ? e.touches[0].clientY
                : (e as React.MouseEvent).clientY;

        ripple.style.left = `${clientX - rect.left - size / 2}px`;
        ripple.style.top = `${clientY - rect.top - size / 2}px`;

        target.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }, []);

    const onClick = useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            triggerRipple(e);
        },
        [triggerRipple],
    );

    const onTouchStart = useCallback(
        (e: React.TouchEvent<HTMLElement>) => {
            holdTimeout.current = window.setTimeout(() => {
                triggerRipple(e.nativeEvent);
            }, 150); // short hold threshold
        },
        [triggerRipple],
    );

    const onTouchEnd = useCallback(() => {
        if (holdTimeout.current) {
            clearTimeout(holdTimeout.current);
            holdTimeout.current = null;
        }
    }, []);

    return {
        onClick,
        onTouchStart,
        onTouchEnd,
    };
};
