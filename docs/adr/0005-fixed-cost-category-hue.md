# Fixed cost categories store a hue, not a hex color

A fixed cost category's color is a hue (0–359) only; the client derives chroma and tones from it (`TonalPalette.fromHueAndChroma`). Any hue then yields MD3 tones that read equally well in light and dark mode, and two categories can only differ by what tells them apart. Transaction categories keep their hex colors, which predate this; both render through the same tonal code.
