import { type FC, useMemo } from "react";
import { addDays, endOfWeek, isSameDay, startOfWeek } from "date-fns";
import { de } from "date-fns/locale";
import { useAppSelector } from "@/redux-hooks.ts";
import { expensesSelectors } from "@/components/expenses/slice.ts";
import {
    DynamicColor,
    Hct,
    hexFromArgb,
    TonalPalette,
} from "@material/material-color-utilities";

const dayLabels = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

const tonalPalette = TonalPalette.fromHct(Hct.from(329, 24, 40));

export const Heatmap: FC = () => {
    const expenses = useAppSelector(expensesSelectors.selectAll);

    const week = useMemo(() => {
        const now = new Date();

        const mondayThisWeek = startOfWeek(now, { locale: de });
        const sundayThisWeek = endOfWeek(now, { locale: de });
        return { start: mondayThisWeek, end: sundayThisWeek };
    }, []);

    // Zähle Ausgaben pro Tag
    const expensesPerDay = useMemo(() => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const day = addDays(week.start, i);
            const count = expenses.filter((e) =>
                isSameDay(new Date(e.date), day),
            ).length;
            days.push({ day, count });
        }
        return days;
    }, [week, expenses]);

    // Finde die maximale Anzahl an Ausgaben an einem Tag (für die Farbskala)
    const maxCount = Math.max(...expensesPerDay.map((d) => d.count), 1);

    function getColor(foo: number) {
        const value = (foo / maxCount) * 100; // Normalize to 0-100 range

        const v = Math.max(0, Math.min(100, value));

        // Map value to a tone: lighter tones for low values, darker for high values
        const tone = Math.round(90 - v * 0.8); // maps 0→90, 100→10
        const bgArgb = tonalPalette.tone(tone);
        const backgroundHex = hexFromArgb(bgArgb);

        // Compute accessible contrasting text tone
        // DynamicColor.foregroundTone finds the best text tone for minimum contrast
        const textTone = DynamicColor.foregroundTone(tone, 4.5);
        const textHex = hexFromArgb(tonalPalette.tone(textTone));

        return { backgroundHex, textHex };
    }

    return (
        <div className={"flex w-full items-center justify-evenly gap-x-2"}>
            {expensesPerDay.map((d, idx) => {
                const palette = getColor(d.count);

                return (
                    <div
                        key={idx}
                        className={"flex flex-col items-center gap-y-1"}
                    >
                        <div className={"text-outline text-sm"}>
                            {d.day.toLocaleDateString("de-DE", {
                                day: "2-digit",
                                month: "2-digit",
                            })}
                        </div>
                        <div
                            className={"size-8 rounded-sm font-bold"}
                            style={{
                                backgroundColor: palette.backgroundHex,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: palette.textHex,
                            }}
                        >
                            {dayLabels[idx]}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
