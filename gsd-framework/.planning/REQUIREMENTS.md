# Requirements: Pikachu Match

**Defined:** 2026-03-10
**Core Value:** The satisfying "aha!" moment when you spot a valid connection and clear a pair — the core matching loop must feel smooth and rewarding.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Core Mechanics

- [ ] **CORE-01**: Game displays a grid of Pokemon tiles arranged in rows and columns
- [ ] **CORE-02**: Player can click/tap to select a tile (highlighted when selected)
- [ ] **CORE-03**: Player can click/tap a second tile to attempt a match
- [ ] **CORE-04**: Two matching tiles connect if a valid path exists with 3 or fewer straight lines
- [ ] **CORE-05**: Connected matching tiles disappear from the board
- [ ] **CORE-06**: Player receives points when tiles are matched and cleared
- [ ] **CORE-07**: Cleared tiles become passable space for future connections
- [ ] **CORE-08**: Game detects when no valid moves remain on the board
- [ ] **CORE-09**: Game detects win condition when all tiles are cleared

### Board & Scoring

- [ ] **BOARD-01**: Player can shuffle remaining tiles when no moves available
- [ ] **BOARD-02**: Score is displayed and updates in real-time

### Visual & UX

- [ ] **UX-01**: Matched tiles animate before disappearing
- [ ] **UX-02**: Game responds to touch input on mobile devices
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
| CORE-01 | Phase 1 | Pending |
| CORE-02 | Phase 2 | Pending |
| CORE-03 | Phase 2 | Pending |
| CORE-04 | Phase 3 | Pending |
| CORE-05 | Phase 3 | Pending |
| CORE-06 | Phase 3 | Pending |
| CORE-07 | Phase 3 | Pending |
| CORE-08 | Phase 4 | Pending |
| CORE-09 | Phase 4 | Pending |
| BOARD-01 | Phase 5 | Pending |
| BOARD-02 | Phase 3 | Pending |
| UX-01 | Phase 6 | Pending |
| UX-02 | Phase 6 | Pending |
| UX-03 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 14 total
- Mapped to phases: 14
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-10*
*Last updated: 2026-03-10 after roadmap creation*
