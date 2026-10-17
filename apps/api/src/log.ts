import { pino } from "pino";

const options = { level: process.env.LOG_LEVEL ?? "info" };

/**
 * JSON lines on stdout; pretty-printed outside production (`pino-pretty` is a
 * dev dependency, missing from the Docker image).
 */
export const logger =
    process.env.NODE_ENV === "production"
        ? pino(options)
        : pino(options, (await import("pino-pretty")).default());
