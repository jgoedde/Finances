// MD3 Expressive vertical menu, standard color style
// (https://m3.material.io/components/menus/specs), shared by the dropdown
// and the context menu. The items sit 4dp inside the 16dp container, so the
// outer corners of the first and last item (12dp) run parallel to it.

export const menuContentClassName = `z-50 flex max-w-[280px] min-w-[112px]
    flex-col gap-0.5 overflow-y-auto rounded-lg bg-surface-container-low p-1
    text-on-surface shadow-elevation-2 data-[state=closed]:animate-out
    data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
    data-[state=open]:animate-in data-[state=open]:fade-in-0
    data-[state=open]:zoom-in-95`;

// 44dp high, 4dp corners; 12dp where the item meets the container's edge
// or a divider. 20dp icons.
export const menuItemClassName = `state-layer relative flex min-h-11
    cursor-pointer items-center gap-3 rounded-xs px-4 text-label-large
    outline-hidden select-none first:rounded-t-md last:rounded-b-md
    [[role=separator]+&]:rounded-t-md [&:has(+[role=separator])]:rounded-b-md
    data-[disabled]:pointer-events-none data-[disabled]:text-on-surface/38
    [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:text-on-surface-variant
    [&_svg:not([class*='size-'])]:size-5`;

// A selected item (e.g. the checked radio item) on its own 12dp container.
export const menuItemSelectedClassName = `data-[state=checked]:rounded-md
    data-[state=checked]:bg-tertiary-container
    data-[state=checked]:text-on-tertiary-container
    data-[state=checked]:[&_svg]:text-on-tertiary-container`;
