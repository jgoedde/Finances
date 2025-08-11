import { Download } from "lucide-react";
import { exportFile } from "@/persistence/db.ts";

export function ExportButton() {
    return (
        <button
            type={"button"}
            onClick={() => {
                void exportFile();
            }}
        >
            <Download className={"text-secondary size-5"} />
        </button>
    );
}
