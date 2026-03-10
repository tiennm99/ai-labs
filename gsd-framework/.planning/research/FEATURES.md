# Feature Research

**Domain:** Tile-matching puzzle games (Onet Connect / Pikachu Kawai style)
**Researched:** 2026-03-10
**Confidence:** MEDIUM

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Grid of paired tiles | Core mechanic - every game in this genre has this | LOW | Always even number of tiles, each type appears in pairs |
| Click-to-select matching | Standard interaction pattern | LOW | Click first tile to select, click second matching tile to attempt connection |
| Path validation (max 3 lines) | Core rule - tiles connect if path uses 3 or fewer straight lines | MEDIUM | Algorithm checks: direct line, 1 turn (L-shape), 2 turns (U/Z-shape) |
| Matched tiles disappear | Visual feedback that match succeeded | LOW | Clear animation, tiles removed from grid |
| Timer / time pressure | Creates urgency - players expect this challenge | LOW | Countdown or elapsed time display |
| Score display | Players want to track performance | LOW | Points for matches, bonus for speed |
| Hint system | Prevents frustration when stuck | MEDIUM | Highlights one valid pair |
| Shuffle feature | Recovery when no moves available | MEDIUM | Rearranges remaining tiles randomly |
| Win condition detection | Game knows when all pairs matched | LOW | Check if board is empty |
| Lose condition (time out) | Failure state for time pressure | LOW | Timer reaches zero |
| No moves detection | Game detects when no valid pairs exist | MEDIUM | Check all remaining pairs for valid paths |
| Responsive layout | Works on desktop and mobile browsers | MEDIUM | Touch and mouse input support |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valuable.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Visual connection preview | Shows the path line before confirming match | MEDIUM | Helps new players learn the rules |
| Multiple tile themes | Variety keeps game fresh (animals, fruits, icons) | LOW | Swap tile images, same mechanics |
| Level progression | Increasing difficulty maintains engagement | MEDIUM | Larger grids, more tile types, less time |
| Combo/scoring multipliers | Rewards skilled/fast play | MEDIUM | Chain matches, speed bonuses |
| Animated match effects | Satisfying visual feedback | MEDIUM | Particles, scaling, glow effects |
| Sound effects | Audio feedback enhances satisfaction | LOW | Match sounds, error sounds, win/lose jingles |
| Local high score | Persistence without backend | LOW | Store in localStorage |
| Undo last move | Forgiveness for misclicks | MEDIUM | Remember previous state |
| Tutorial overlay | First-time player guidance | LOW | Visual guide showing valid connection patterns |
| Dark/light theme | Accessibility and preference | LOW | CSS variable swap |
| Keyboard controls | Alternative to mouse for accessibility | MEDIUM | Arrow keys + enter to select tiles |
| Auto-save progress | Resume later if interrupted | MEDIUM | Save game state to localStorage |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Unlimited hints without penalty | Players want help when stuck | Removes all challenge, trivializes game | Limited hints per level, hints cost points |
| No timer option | Some players dislike pressure | Removes core tension that makes game engaging | Relaxed mode as unlockable, not default |
| Auto-match button | "Just do it for me" | Turns game into watching, not playing | Better hint system that teaches patterns |
| Complex power-ups (bombs, freezes) | Adds "excitement" | Bloats simple elegant mechanic, confuses new players | Keep power-ups minimal (hint, shuffle only) |
| Multiplayer competitive | "Play with friends" | Significantly increases scope, needs backend | Local high score comparison instead |
| In-app purchases | Revenue generation | Adds friction, feels predatory in simple game | Ad-supported or one-time purchase |
| Facebook/social login | "Share scores easily" | Privacy concerns, third-party dependency | Local storage, optional screenshot sharing |
| Daily challenges | "Reason to return daily" | Needs content pipeline, backend for consistency | Procedural levels with seed-based generation |

## Feature Dependencies

```
Grid Rendering
    └──requires──> Tile Selection
                       └──requires──> Path Validation
                                          └──requires──> Match Animation
                                                             └──requires──> Score Update

No Moves Detection
    └──enables──> Shuffle Feature

Timer System
    └──conflicts──> Untimed/Relaxed Mode (different game modes)

Hint System
    └──requires──> Path Validation (reuse algorithm)

Level Progression
    └──requires──> Win Condition Detection
    └──requires──> Level Data (grid size, tile types, time limit)

Local High Score
    └──requires──> Score Display
```

### Dependency Notes

- **Hint System requires Path Validation:** Hints must find valid pairs using the same pathfinding algorithm
- **No Moves Detection enables Shuffle:** Shuffle only makes sense when player is stuck
- **Timer System conflicts with Relaxed Mode:** Different game modes, should be separate options
- **Level Progression requires multiple systems:** Win detection to advance, level data to configure next board

## MVP Definition

### Launch With (v1)

Minimum viable product - what's needed to validate the concept.

- [x] Grid of paired tiles (even count, matched pairs) - Core mechanic
- [x] Click-to-select two matching tiles - Standard interaction
- [x] Path validation (max 3 straight lines / 2 turns) - Core rule
- [x] Matched tiles disappear with animation - Visual feedback
- [x] Score display - Performance tracking
- [x] Timer with lose condition - Time pressure
- [x] Win condition (board cleared) - Success state
- [x] No moves detection + shuffle - Recovery mechanism
- [x] Responsive grid (desktop + mobile) - Platform requirement

### Add After Validation (v1.x)

Features to add once core is working.

- [ ] Hint system (limited uses) - Prevents frustration
- [ ] Visual connection preview - Helps learn rules
- [ ] Local high score (localStorage) - Persistence without backend
- [ ] Sound effects - Audio satisfaction
- [ ] Tutorial overlay for first-time players - Onboarding

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] Multiple tile themes - Visual variety
- [ ] Level progression with difficulty scaling - Long-term engagement
- [ ] Combo multipliers - Depth for skilled players
- [ ] Dark/light theme toggle - Accessibility
- [ ] Keyboard controls - Accessibility
- [ ] Undo last move - Forgiveness

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Grid + tile rendering | HIGH | LOW | P1 |
| Click selection | HIGH | LOW | P1 |
| Path validation (3 lines) | HIGH | MEDIUM | P1 |
| Match animation + removal | HIGH | LOW | P1 |
| Score display | MEDIUM | LOW | P1 |
| Timer + lose condition | HIGH | LOW | P1 |
| Win condition | HIGH | LOW | P1 |
| No moves detection | HIGH | MEDIUM | P1 |
| Shuffle feature | HIGH | MEDIUM | P1 |
| Responsive layout | HIGH | MEDIUM | P1 |
| Hint system | MEDIUM | MEDIUM | P2 |
| Connection preview | MEDIUM | MEDIUM | P2 |
| Local high score | MEDIUM | LOW | P2 |
| Sound effects | MEDIUM | LOW | P2 |
| Tutorial overlay | MEDIUM | LOW | P2 |
| Multiple themes | LOW | LOW | P3 |
| Level progression | MEDIUM | HIGH | P3 |
| Combo scoring | LOW | MEDIUM | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | Onet Connect Classic (CrazyGames) | Pikachu Kawai | Our Approach |
|---------|-----------------------------------|---------------|--------------|
| Core mechanic | Match pairs via 3-line paths | Same | Same - proven formula |
| Timer | Yes, countdown | Yes | Yes - core tension |
| Hints | 3 free, then watch ad | Limited hints | Limited hints (no ads) |
| Shuffle | Earned through wins | Yes | Always available when stuck |
| Themes | Animals, candy, fruits | Pokemon only | Pokemon theme (per project) |
| Levels | Progressive difficulty | Multiple levels | Single level for v1 |
| Ads | Yes (between games) | Varies by version | None for v1 |
| Mobile support | Yes | Yes | Yes - responsive |

## Sources

- [Onet Connect Classic - CrazyGames](https://www.crazygames.com/game/onet-connect-classic) - Feature analysis: timer, hints, shuffle, themes, levels
- Project context from PROJECT.md - Core requirements and constraints
- Domain knowledge of tile-matching puzzle genre conventions

---
*Feature research for: Tile-matching puzzle games (Onet Connect style)*
*Researched: 2026-03-10*
