// PROTOTYPE (throwaway, issue #419): floating variant switcher.
import { useLocation, useRouter } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";

/**
 * Reads `?<param>=` from the raw URL; falls back to the first variant key.
 */
export function usePrototypeParam(param: string, keys: string[]): string {
    const searchStr = useLocation({ select: (l) => l.searchStr });
    const value = new URLSearchParams(searchStr).get(param);
    return value && keys.includes(value) ? value : (keys[0] ?? "");
}

interface PrototypeSwitcherProps {
    variants: { key: string; name: string }[];
    current: string;
}

/**
 * Cycles `?variant=` with the arrows or ←/→. Dev builds only.
 */
export function PrototypeSwitcher({
    variants,
    current,
}: PrototypeSwitcherProps) {
    const router = useRouter();
    const index = Math.max(
        0,
        variants.findIndex((v) => v.key === current),
    );

    function go(step: number) {
        const next =
            variants[(index + step + variants.length) % variants.length];
        if (!next) return;
        const url = new URL(window.location.href);
        url.searchParams.set("variant", next.key);
        router.history.replace(url.pathname + url.search);
    }

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            const t = e.target as HTMLElement | null;
            if (
                t?.closest("input, textarea, [contenteditable]") ||
                (e.key !== "ArrowLeft" && e.key !== "ArrowRight")
            ) {
                return;
            }
            go(e.key === "ArrowLeft" ? -1 : 1);
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    });

    if (!import.meta.env.DEV) return null;

    const variant = variants[index];
    return (
        <div
            style={{
                position: "fixed",
                bottom: 16,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 10px",
                borderRadius: 999,
                background: "#111",
                color: "#fff",
                font: "600 13px system-ui",
                boxShadow: "0 4px 16px rgba(0,0,0,.4)",
            }}
        >
            <button type="button" onClick={() => go(-1)} aria-label="Previous">
                <ChevronLeft size={18} />
            </button>
            <span>
                {variant?.key} ({variant?.name})
            </span>
            <button type="button" onClick={() => go(1)} aria-label="Next">
                <ChevronRight size={18} />
            </button>
        </div>
    );
}

/**
 * Dashed box for stub toggles, so it reads as not part of the design.
 */
export function PrototypeStubPanel({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div
            style={{
                columnSpan: "all",
                border: "2px dashed #e11d48",
                borderRadius: 8,
                padding: 8,
                font: "12px system-ui",
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                color: "inherit",
            }}
        >
            <strong style={{ color: "#e11d48" }}>PROTOTYPE stub</strong>
            {children}
        </div>
    );
}

export function StubToggle({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <label style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
            {label}
        </label>
    );
}
