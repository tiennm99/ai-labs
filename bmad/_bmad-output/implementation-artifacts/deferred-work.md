# Deferred Work

## Deferred from: code review of Epic 1 (2026-04-13)

- **Best score always 0, never tracked** — UI displays "BEST: 0" that never updates. Covered by Story 2-1 (Best Score Tracking).
- **Tile keyed by position, not identity** — `Grid.svelte` keys tiles by `r-c` grid position instead of unique tile ID. Will break slide/merge animations. Address in Epic 3 (animations).
- **No animation lock for rapid key input** — No debounce or move-in-progress guard in `handleKeydown`. Synchronous now but will need a lock when animations are added in Epic 3.
- **Grid 500px overflow on narrow viewports** — `Grid.svelte` hardcodes `containerSize = 500`. Overflows on mobile. Covered by Story 4-3 (Responsive Layout).
- **Tile font overflow for very large values** — 3-tier font sizing (55/45/35px) exists but values beyond 8192 (6+ digits) may overflow the 106px cell at 35px. Epic 5 polish.
- **Overlay has no keyboard focus trap** — `GameMessage.svelte` does not trap focus or auto-focus the action button. Accessibility improvement for post-MVP.
