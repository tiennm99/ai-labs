# Pikachu Match

## What This Is

A web-based tile-matching puzzle game where players find and connect matching Pokemon pairs on a grid. Two tiles can be matched if they can be connected by 3 or fewer straight lines with no obstacles. Cleared tiles open new paths for future matches.

## Core Value

The satisfying "aha!" moment when you spot a valid connection and clear a pair — the core matching loop must feel smooth and rewarding.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Game displays a grid of Pokemon tiles
- [ ] Player can click two matching tiles to attempt a connection
- [ ] Tiles connect if path uses 3 or fewer straight lines
- [ ] Matched tiles disappear and award points
- [ ] Cleared tiles become passable for future connections
- [ ] Game detects when no valid moves remain

### Out of Scope

- Multiplayer — v1 is single player only
- Multiple levels — one level proves the fun
- High score persistence — no backend for v1
- Mobile app — web browser only
- Sound effects — can add later if fun

## Context

Classic tile-matching puzzle games (Pikachu Kawai, Onet Connect) have proven this mechanic is engaging. The path-finding algorithm (max 3 turns) is well-documented. This v1 focuses on proving the core loop is fun before adding complexity.

## Constraints

- **Platform**: Web browser (desktop and mobile responsive)
- **Scope**: Minimal playable — one level, core mechanics only
- **Style**: Colorful and playful aesthetic

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Web browser first | Broadest reach, no install friction | — Pending |
| Single level for v1 | Prove core fun before adding content | — Pending |
| No backend | Keep v1 simple, add persistence later | — Pending |

---
*Last updated: 2026-03-10 after initialization*
