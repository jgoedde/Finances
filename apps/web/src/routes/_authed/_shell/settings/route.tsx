import { createFileRoute } from "@tanstack/react-router";

// The settings and their subpages (categories). Without a component it
// renders the matching child, and keeps the settings destination active.
export const Route = createFileRoute("/_authed/_shell/settings")({});
