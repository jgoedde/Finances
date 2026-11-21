// Registers the locale strategy before any message renders.
import "#/i18n.ts";
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

// Keeps `web-haptics` from injecting its hidden switch checkbox into the body,
// which role-based queries would find.
vi.mock("#/lib/haptics.ts", () => ({
    tick: vi.fn(),
    saved: vi.fn(),
    deleted: vi.fn(),
    error: vi.fn(),
}));

beforeEach(() => {
    localStorage.setItem("finances-locale", "de");
});

afterEach(() => {
    cleanup();
    localStorage.clear();
});
