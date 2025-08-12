import { Download } from "lucide-react";
import { PersistentDatabase } from "@/persistence/persistent-database.ts";

export function ExportButton() {
    return (
        <button
            type={"button"}
            onClick={() => {
                void PersistentDatabase.exportFile();
            }}
        >
            <Download className={"text-secondary size-5"} />
        </button>
    );
}
