import * as React from "react";
import { useRef } from "react";

/**
 * Custom hook to add a material design like ripple effect to a button or any other element.
 *
 * @example
 * ```tsx
 * import { useRipple } from "./use-ripple";
 *
 * const MyButton = () => {
 *   const ripple = useRipple();
 *
 *   return (
 *     <button
 *       className="ripple-container"
 *       data-ripple-color="bg-blue-500" // Any CSS class for the ripple color
 *       {...ripple}
 *     >
 *       Click me
 *     </button>
 *   );
 * }
 * ```
 */
export const useRipple = () => {
    const holdTimeout = useRef<number | null>(null);

    function triggerRipple(e: React.MouseEvent | TouchEvent) {
        const target: HTMLElement | null = (e.target as HTMLElement)?.closest(
            ".ripple-container",
        );
        if (!target) return;

        const rect = target.getBoundingClientRect();
        const ripple = document.createElement("span");

        const colorClass = target.dataset.rippleColor ?? "bg-white";
        ripple.className = `ripple ${colorClass}`;

        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;

        const touch = "touches" in e ? e.touches[0] : undefined;

        if (!touch) return;

        const clientX = "touches" in e ? touch.clientX : e.clientX;
        const clientY = "touches" in e ? touch.clientY : e.clientY;

        ripple.style.left = `${clientX - rect.left - size / 2}px`;
        ripple.style.top = `${clientY - rect.top - size / 2}px`;

        target.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    function onClick(e: React.MouseEvent<HTMLElement>) {
        triggerRipple(e);
    }

    function onTouchStart(e: React.TouchEvent<HTMLElement>) {
        holdTimeout.current = window.setTimeout(() => {
            triggerRipple(e.nativeEvent);
        }, 150);
    }

    function onTouchEnd() {
        if (holdTimeout.current) {
            clearTimeout(holdTimeout.current);
            holdTimeout.current = null;
        }
    }

    return {
        onClick,
        onTouchStart,
        onTouchEnd,
    };
};
