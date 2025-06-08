import { readLocalStorageValue } from "@mantine/hooks";
import { Download } from "lucide-react";

export function ExportButton() {
    return (
        <button
            onClick={() => {
                const blob = new Blob(
                    [
                        readLocalStorageValue({
                            key: "expenses",
                            defaultValue: "",
                        }),
                    ],
                    {
                        type: "application/text",
                    },
                );
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${Date.now()}-expenses.txt`;
                a.click();
                URL.revokeObjectURL(url);
            }}
        >
            <Download className={"text-secondary size-5"} />
        </button>
    );
}
