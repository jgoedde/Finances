import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef } from "react";
import { Input } from "@/components/ui/input.tsx";
import { importFile } from "@/persistence/db.ts";

export const Route = createFileRoute("/blob")({
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div>
            <Input
                type={"file"}
                max={1}
                multiple={false}
                ref={fileInputRef}
                onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;

                    await importFile(file);
                    void navigate({ to: "/setup" });
                }}
            />
        </div>
    );
}
