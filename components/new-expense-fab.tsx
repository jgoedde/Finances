"use client";

import { Banknote } from "lucide-react";
import { useRouter } from "next/navigation";

export function NewExpenseFAB() {
    const router = useRouter();

    return (
        <button
            className={
                "bg-primary-container text-on-primary-container absolute right-0 bottom-0 size-16 -translate-x-1/2 -translate-y-1/2 rounded-sm shadow-lg"
            }
            onClick={() => {
                router.push("/new");
            }}
        >
            <Banknote className={"mx-auto size-10 h-full"} />
        </button>
    );
}
