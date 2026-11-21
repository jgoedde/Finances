// MD3 menu (https://m3.material.io/components/menus/specs), shared by the
// dropdown and the context menu.

export const menuContentClassName = `z-50 max-w-[280px] min-w-[112px]
    overflow-y-auto rounded-xs bg-surface-container py-2 text-on-surface
    shadow-elevation-2 data-[state=closed]:animate-out
    data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
    data-[state=open]:animate-in data-[state=open]:fade-in-0
    data-[state=open]:zoom-in-95`;

export const menuItemClassName = `state-layer relative flex h-12 cursor-pointer
    items-center gap-3 px-3 text-label-large outline-hidden select-none
    data-[disabled]:pointer-events-none data-[disabled]:text-on-surface/38
    [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:text-on-surface-variant
    [&_svg:not([class*='size-'])]:size-6`;
