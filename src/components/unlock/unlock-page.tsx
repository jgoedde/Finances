import { useLocalStorage } from "@mantine/hooks";
import { SetupWizard } from "@/components/unlock/setup-wizard.tsx";
import { UnlockLocalStorage } from "@/components/unlock/unlock-local-storage.tsx";

export function UnlockPage() {
    const [ls] = useLocalStorage({ key: "expenses", defaultValue: "" });

    const hasData = ls.trim() !== "";

    /*
    localStorage.setItem("expenses", "");
    localStorage.setItem("encryption-key", "");
*/

    const comp = () => {
        if (!hasData) {
            return <SetupWizard />;
        }

        return <UnlockLocalStorage encryptedDatabase={ls} />;
    };

    return (
        <div>
            {comp()}
        </div>
    );
}
