import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
    CircleAlert,
    CloudCheck,
    CloudOff,
    LogOut,
    RefreshCw,
    Settings,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog.tsx";
import { sessionQuery } from "@/auth/auth-client.ts";
import { useSignOut } from "@/features/auth/use-sign-out.ts";
import { SyncDrawer } from "@/features/sync/sync-drawer.tsx";
import {
    type SyncState,
    type SyncStatus,
    useSyncStatus,
} from "@/features/sync/use-sync-status.ts";
import { cn } from "@/lib/cn.ts";

const BADGE_CLASS = {
    failed: "bg-error",
    offline: "bg-outline",
    pending: "bg-primary",
    synced: null,
} as const satisfies Record<SyncState, string | null>;

function syncMenuItem(status: SyncStatus) {
    switch (status.state) {
        case "failed":
            return {
                icon: <CircleAlert className={"text-error"} />,
                label: `${status.failures.length} abgelehnt`,
            };
        case "offline":
            return {
                icon: <CloudOff />,
                label:
                    status.pending.length > 0
                        ? `Offline · ${status.pending.length} ausstehend`
                        : "Offline",
            };
        case "pending":
            return {
                icon: <RefreshCw />,
                label: `${status.pending.length} ausstehend`,
            };
        case "synced":
            return { icon: <CloudCheck />, label: "Alles synchronisiert" };
        default:
            throw new Error(
                `Not implemented sync status "${status.state satisfies never}".`,
            );
    }
}

/** Avatar with the sync indicator; opens the account menu. */
export function AccountMenu() {
    const user = useQuery(sessionQuery).data;
    const status = useSyncStatus();
    const signOut = useSignOut();

    const [isSyncDrawerOpen, setIsSyncDrawerOpen] = useState(false);
    const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);

    const username = user?.username ?? "";
    const badgeClass = BADGE_CLASS[status.state];
    const syncItem = syncMenuItem(status);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger
                    className={`state-layer relative flex size-12 shrink-0
                        cursor-pointer items-center justify-center rounded-full
                        focus-ring`}
                    aria-label={`Konto von ${username}, ${syncItem.label}`}
                >
                    <Avatar>
                        <AvatarFallback>
                            {username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    {badgeClass && (
                        <span
                            aria-hidden
                            className={cn(
                                `absolute top-2 right-2 size-2.5 rounded-full
                                ring-2 ring-surface-container-high`,
                                badgeClass,
                            )}
                        />
                    )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align={"end"} className={"min-w-56"}>
                    <DropdownMenuLabel>
                        Angemeldet als {username}
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                        onSelect={() => setIsSyncDrawerOpen(true)}
                    >
                        {syncItem.icon}
                        {syncItem.label}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link to={"/settings"}>
                            <Settings />
                            Einstellungen
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={() => {
                            if (status.pending.length > 0) {
                                setIsSignOutDialogOpen(true);
                            } else {
                                void signOut();
                            }
                        }}
                    >
                        <LogOut />
                        Abmelden
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <SyncDrawer
                open={isSyncDrawerOpen}
                onOpenChange={setIsSyncDrawerOpen}
            />

            <AlertDialog
                open={isSignOutDialogOpen}
                onOpenChange={setIsSignOutDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Trotzdem abmelden?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {status.pending.length} Änderungen wurden noch nicht
                            synchronisiert und gehen beim Abmelden verloren.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                        <AlertDialogAction onClick={() => void signOut()}>
                            Abmelden
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
