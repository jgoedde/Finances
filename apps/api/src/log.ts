import { pino } from "pino";

const options = { level: process.env.LOG_LEVEL ?? "info" };

/**
 * stdout, or stderr for the CLI (see `cli/log-to-stderr.ts`).
 */
const fd = process.env.LOG_DESTINATION === "stderr" ? 2 : 1;

/**
 * JSON lines; pretty-printed outside production (`pino-pretty` is a dev
 * dependency, missing from the Docker image).
 */
export const logger =
    process.env.NODE_ENV === "production"
        ? pino(options, pino.destination({ dest: fd, sync: true }))
        : pino(
              options,
              (await import("pino-pretty")).default({ destination: fd }),
          );
