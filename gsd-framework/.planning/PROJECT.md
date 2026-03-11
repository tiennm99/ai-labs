# Pikachu Match

## What This Is

A web-based tile-matching puzzle game where players find and connect matching Pokemon pairs on a grid. Two tiles can be matched if they can be connected by 3 or fewer straight lines with no obstacles. Cleared tiles open new paths for future matches. Features smooth animations, responsive design, and automatic shuffle recovery.

## Core Value

The satisfying "aha!" moment when you spot a valid connection and clear a pair — the core matching loop must feel smooth and rewarding.

## Requirements

### Validated

- ✓ Grid of Pokemon tiles with selection highlighting — v1.0
- ✓ Click two matching tiles to attempt connection — v1.0
- ✓ Path-finding with 3 or fewer straight lines — v1.0
- ✓ Matched tiles animate and disappear — v1.0
- ✓ Score system with complexity bonus — v1.0
- ✓ Cleared tiles become passable — v1.0
- ✓ Win/lose detection with overlays — v1.0
- ✓ Auto-shuffle when no moves available — v1.0
- ✓ Responsive design (mobile + desktop) — v1.0

### Active

(Ready for v1.1 planning)
- [ ] Sound effects for matches and game events
- [ ] Timer with countdown pressure
- [ ] Hint system
- [ ] Multiple levels with increasing difficulty
- [ ] Local high score persistence

### Out of Scope

- Multiplayer — v1 is single player only (still valid)
- Backend/Accounts — Keep simple, no server needed (still valid)
- Mobile app — web browser only (PWA works well)

## Context

**Shipped v1.0 MVP** on 2026-03-11.
- 6 phases, 22 plans executed
- Core matching loop complete with animations
- Responsive canvas scaling for mobile/desktop
- Auto-shuffle recovery system
- Known issue: Match event wiring may need attention in some edge cases

**Tech Stack:** Vite, TypeScript, Canvas API, Vitest

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Web browser first | Broadest reach, no install friction | ✓ Good - Works on all devices |
| Single level for v1 | Prove core fun before adding content | ✓ Good - Core loop validated |
| No backend | Keep v1 simple, add persistence later | ✓ Good - Zero deployment complexity |
| BFS over A* for pathfinding | Simpler implementation, good enough for grid | ✓ Good - 94% optimization via type grouping |
| HTML overlays for UI | Better accessibility than canvas text | ✓ Good - Score/game-over work well |
| CSS transform for responsive | Preserves canvas coordinates | ✓ Good - Touch/click mapping works |
| Scale down only | Maintain visual quality on large screens | ✓ Good - No blur on desktop |

## Constraints

- **Platform**: Web browser (desktop and mobile responsive)
- **Scope**: Minimal playable — one level, core mechanics only
- **Style**: Colorful and playful aesthetic

---
*Last updated: 2026-03-11 after v1.0 milestone*
