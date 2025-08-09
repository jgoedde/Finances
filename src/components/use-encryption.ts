import { useAppDispatch, useAppSelector } from "@/redux-hooks.ts";
import { selectMasterPassword, setMasterPassword } from "@/app-slice.ts";

export function useEncryption(): {
    key?: string;
    setKey: (key: string | undefined) => void;
} {
    const dispatch = useAppDispatch();
    const key = useAppSelector(selectMasterPassword);

    function setKey(v?: string) {
        dispatch(setMasterPassword(v));
    }

    return { key, setKey };
}
