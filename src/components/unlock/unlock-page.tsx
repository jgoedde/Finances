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
        <div className={"relative h-dvh overflow-x-scroll"}>
            <div className="absolute inset-0 scale-110 bg-[url(/unlock-bg.jpg)] bg-cover bg-center blur-xs"></div>

            {comp()}
        </div>
    );
}
