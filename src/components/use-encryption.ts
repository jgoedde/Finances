import { useSessionStorage } from "@mantine/hooks";

export function useEncryption(): {
    key?: string;
    setKey: (key: string | undefined) => void;
} {
    const [key, setKey] = useSessionStorage<string | undefined>({
        key: "encryption-key",
        getInitialValueInEffect: false,
    });

    return { key, setKey };
}
