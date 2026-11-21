import type { FixedCostInterval } from "@finances/shared";

export type StepId =
    "name" | "amount" | "interval" | "startDate" | "endDate" | "category";

export const STEPS: StepId[] = [
    "name",
    "amount",
    "category",
    "interval",
    "startDate",
    "endDate",
];

export interface FixedCostWizardValues {
    name: string;
    amount: number;
    interval: FixedCostInterval;

    /**
     * `YYYY-MM-DD`
     */
    startDate: string;

    /**
     * `YYYY-MM-DD`
     */
    endDate: string | null;
    categoryId: string;
}
