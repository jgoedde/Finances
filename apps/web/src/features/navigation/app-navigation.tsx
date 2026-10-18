import { NavigationBar } from "#/features/navigation/navigation-bar.tsx";
import { NavigationRail } from "#/features/navigation/navigation-rail.tsx";
import { NavigationDrawer } from "#/features/navigation/navigation-drawer.tsx";

interface AppNavigationProps {
    isDetailOpen: boolean;
}

/**
 * MD3 navigation per window size class: navigation bar (compact),
 * navigation rail (medium), permanent navigation drawer (expanded).
 * Bar and rail make way for a full-screen detail.
 */
export function AppNavigation({ isDetailOpen }: AppNavigationProps) {
    return (
        <>
            {!isDetailOpen && <NavigationBar />}
            {!isDetailOpen && <NavigationRail />}
            <NavigationDrawer />
        </>
    );
}
