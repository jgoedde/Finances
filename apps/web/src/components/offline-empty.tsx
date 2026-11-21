import CloudOffIcon from "~icons/material-symbols/cloud-off-outline-rounded";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "#/components/ui/empty.tsx";
import { m } from "#/paraglide/messages.js";

interface OfflineEmptyProps {
    /**
     * What isn't available offline.
     */
    description: string;
}

/**
 * Empty state for content that can't load while offline.
 */
export function OfflineEmpty({ description }: OfflineEmptyProps) {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia>
                    <CloudOffIcon />
                </EmptyMedia>
                <EmptyTitle>{m.offline_title()}</EmptyTitle>
                <EmptyDescription>{description}</EmptyDescription>
            </EmptyHeader>
        </Empty>
    );
}
