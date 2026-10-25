// Registers the locale strategy before any message renders.
import "#/i18n.ts";
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";

beforeEach(() => {
    localStorage.setItem("finances-locale", "de");
});

afterEach(() => {
    cleanup();
    localStorage.clear();
});
