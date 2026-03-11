# Requirements: Pikachu Match

**Defined:** 2026-03-10
**Core Value:** The satisfying "aha!" moment when you spot a valid connection and clear a pair — the core matching loop must feel smooth and rewarding.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Core Mechanics

- [x] **CORE-01**: Game displays a grid of Pokemon tiles arranged in rows and columns
- [x] **CORE-02**: Player can click/tap to select a tile (highlighted when selected)
- [x] **CORE-03**: Player can click/tap a second tile to attempt a match
- [x] **CORE-04**: Two matching tiles connect if a valid path exists with 3 or fewer straight lines
- [x] **CORE-05**: Connected matching tiles disappear from the board
- [x] **CORE-06**: Player receives points when tiles are matched and cleared
- [x] **CORE-07**: Cleared tiles become passable space for future connections
- [x] **CORE-08**: Game detects when no valid moves remain on the board
- [x] **CORE-09**: Game detects win condition when all tiles are cleared

### Board & Scoring

- [ ] **BOARD-01**: Player can shuffle remaining tiles when no moves available
- [x] **BOARD-02**: Score is displayed and updates in real-time

### Visual & UX

- [x] **UX-01**: Matched tiles animate before disappearing
- [x] **UX-02**: Game responds to touch input on mobile devices
- [ ] **UX-03**: Grid layout is responsive (works on phone and desktop)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Enhanced Gameplay

- **ENHC-01**: Timer with countdown pressure
- **ENHC-02**: Lose condition when time runs out
- **ENHC-03**: Hint system (highlights a valid match)
- **ENHC-04**: Path preview on hover (shows connection line)
- **ENHC-05**: Sound effects for matches and game events

### Progression

- **PROG-01**: Multiple levels with increasing difficulty
- **PROG-02**: Level progression with different grid sizes
- **PROG-03**: Local high score persistence

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Multiplayer | v1 is single player only |
| Backend/Accounts | Keep v1 simple, no server needed |
| Multiple levels | One level proves the fun first |
| Sound effects | Can add later if core is fun |
| Timer/Lose condition | v1 focuses on relaxing puzzle solving |
| Hint system | Players should discover matches themselves in v1 |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| CORE-01 | Phase 1 | Complete |
| CORE-02 | Phase 2 | Complete |
| CORE-03 | Phase 2 | Complete |
| CORE-04 | Phase 3 | Complete |
| CORE-05 | Phase 3 | Complete |
| CORE-06 | Phase 3 | Complete |
| CORE-07 | Phase 3 | Complete |
| CORE-08 | Phase 4 | Complete |
| CORE-09 | Phase 4 | Complete |
| BOARD-01 | Phase 5 | Pending |
| BOARD-02 | Phase 3 | Complete |
| UX-01 | Phase 6 | Complete |
| UX-02 | Phase 6 | Complete |
| UX-03 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 14 total
- Mapped to phases: 14
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-10*
*Last updated: 2026-03-10 after 01-01-PLAN completion (CORE-01)*
