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
} from "#/components/ui/dropdown-menu.tsx";
import { Avatar, AvatarFallback } from "#/components/ui/avatar.tsx";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "#/components/ui/alert-dialog.tsx";
import { sessionQuery } from "#/auth/auth-client.ts";
import { useSignOut } from "#/features/auth/use-sign-out.ts";
import { SyncDrawer } from "#/features/sync/sync-drawer.tsx";
import {
    type SyncState,
    type SyncStatus,
    useSyncStatus,
} from "#/features/sync/use-sync-status.ts";
import { cn } from "#/lib/cn.ts";
import { m } from "#/paraglide/messages.js";

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
                label: m.sync_menu_failed({ count: status.failures.length }),
            };
        case "offline":
            return {
                icon: <CloudOff />,
                label:
                    status.pending.length > 0
                        ? m.sync_menu_offline_pending({
                              count: status.pending.length,
                          })
                        : m.sync_menu_offline(),
            };
        case "pending":
            return {
                icon: <RefreshCw />,
                label: m.sync_menu_pending({ count: status.pending.length }),
            };
        case "synced":
            return { icon: <CloudCheck />, label: m.sync_menu_synced() };
        default:
            throw new Error(
                `Not implemented sync status "${String(status.state satisfies never)}".`,
            );
    }
}

interface AccountMenuProps {
    /**
     * Where the menu opens: below in a top app bar, right in a rail or drawer.
     */
    side?: "bottom" | "right";
    className?: string;
}

/**
 * Avatar with the sync indicator; opens the account menu.
 */
export function AccountMenu({ side = "bottom", className }: AccountMenuProps) {
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
                    className={cn(
                        `state-layer relative flex size-12 shrink-0
                        cursor-pointer items-center justify-center rounded-full
                        focus-ring`,
                        className,
                    )}
                    aria-label={m.account_menu_label({
                        username,
                        status: syncItem.label,
                    })}
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
                                ring-2 ring-surface`,
                                badgeClass,
                            )}
                        />
                    )}
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    side={side}
                    align={"end"}
                    className={"min-w-56"}
                >
                    <DropdownMenuLabel>
                        {m.account_signed_in_as({ username })}
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
                            {m.settings_title()}
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
                        {m.action_sign_out()}
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
                        <AlertDialogTitle>
                            {m.sign_out_anyway_title()}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {m.sign_out_unsynced_changes({
                                count: status.pending.length,
                            })}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            {m.action_cancel()}
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={() => void signOut()}>
                            {m.action_sign_out()}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
