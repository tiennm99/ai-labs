# Fix Collision Behavior and Physics Tuning

**Status**: Draft
**Authors**: Claude Code, 2026-04-12
**Type**: Bugfix / Improvement

---

## Overview

Fix the "weird collision" behavior in the Suika Game by addressing physics tuning issues and improving merge execution safety. The current implementation has unstable collision feel due to low density values, missing delta clamping, and a fragile merge removal pattern that can cause ghost bodies and unexpected cascading merges.

## Background / Problem Statement

The current game uses raw Matter.js (v0.20) with Canvas2D rendering. Players report that collisions feel "weird" — fruits appear floaty, merges can glitch, and physics behavior is inconsistent. Investigation reveals several root causes:

1. **Physics tuning**: Uniform density of 0.001 makes all fruits unrealistically light. Large fruits don't feel heavier than small ones.
2. **Merge timing**: Bodies flagged for removal (`removing: true`) remain physically active until `flushMerges()` runs. During that window, they can collide with other fruits, potentially triggering unintended merges.
3. **Frame delta unclamped**: Lag spikes can cause huge physics steps where bodies tunnel through walls or each other.
4. **No scaled density**: All fruits share the same density regardless of tier, so a Watermelon (radius 77) doesn't feel meaningfully heavier than a Cherry (radius 12) beyond area-based mass.

### Why Not Phaser?

Research confirms that Phaser 3 (v3.90.0) wraps Matter.js without adding deferred-removal or safer collision handling. The `collisionstart` event in Phaser has the exact same mid-step mutation risk. Phaser adds ~345 KB gzipped for features (sprite management, scene system, asset loading) that this game doesn't need. Fixing the issues in the current codebase is more appropriate.

## Goals

- Make fruit collisions feel physically satisfying and stable
- Eliminate ghost bodies and double-merge glitches
- Ensure larger fruits feel heavier and more impactful
- Prevent frame-spike physics tunneling
- Keep the existing vanilla JS + Matter.js architecture

## Non-Goals

- Migrating to Phaser or another game framework
- Adding visual effects (particles, screen shake) for merges
- Changing the fruit progression chain or scoring system
- Adding sound effects

## Technical Dependencies

| Dependency | Version | Purpose |
|---|---|---|
| [Matter.js](https://brm.io/matter-js/) | ^0.20.0 | 2D physics engine (already installed) |

No new dependencies required.

## Detailed Design

### 1. Tier-Scaled Density

Replace the uniform density with per-tier density scaling. Larger fruits should be denser, making them settle more firmly and push smaller fruits aside.

**File**: `src/constants.js`

```javascript
// Replace flat density with base + scaling
export const BASE_DENSITY = 0.002;
export const DENSITY_SCALE_PER_TIER = 0.0005;
```

**File**: `src/physics.js` — `createFruitBody()`

```javascript
export function createFruitBody(tier, x, y) {
  const fruit = FRUITS[tier];
  const density = BASE_DENSITY + DENSITY_SCALE_PER_TIER * tier;
  const body = Bodies.circle(x, y, fruit.radius, {
    ...FRUIT_BODY_OPTIONS,
    density,
    label: `fruit_${tier}`,
  });
  body.fruitTier = tier;
  body.removing = false;
  body.dropTime = Date.now();
  return body;
}
```

This gives Cherry ~0.002 density and Watermelon ~0.007 — a 3.5x density increase on top of the much larger area, making watermelons feel substantially heavier.

### 2. Improved Physics Constants

**File**: `src/constants.js`

```javascript
export const GRAVITY = { x: 0, y: 1.8 };  // Slightly stronger gravity

export const FRUIT_BODY_OPTIONS = {
  restitution: 0.3,     // Slightly bouncier for more satisfying collisions
  friction: 0.3,        // Lower friction so fruits slide and settle naturally
  frictionAir: 0.02,    // More air drag to dampen chaotic bouncing
  frictionStatic: 0.5,  // Higher static friction so stacked fruits don't slide
};
```

Key changes:
- **restitution 0.2 → 0.3**: More responsive bounce on contact
- **friction 0.5 → 0.3**: Fruits slide into gaps more naturally
- **frictionAir 0.01 → 0.02**: Reduces floaty drifting
- **frictionStatic (new) 0.5**: Prevents settled stacks from sliding
- **gravity 1.5 → 1.8**: Faster settling, feels more weighty

### 3. Delta Time Clamping

**File**: `src/game.js` — `loop()`

```javascript
loop(time) {
  const rawDelta = time - this.lastTime;
  const delta = Math.min(rawDelta, 20); // Cap at ~50fps equivalent
  this.lastTime = time;
  // ...
}
```

This prevents lag spikes from causing physics tunneling. At 20ms max, the physics engine never advances more than one "normal" frame's worth of simulation per step.

### 4. Safer Merge Execution with Collision Filtering

The current approach already defers removal to `flushMerges()` after `stepEngine()`, which is correct. The remaining issue is that bodies flagged `removing: true` can still physically collide with other bodies during the same frame.

**File**: `src/merger.js` — In the collision handler, after flagging bodies:

```javascript
Events.on(engine, 'collisionStart', (event) => {
  for (const pair of event.pairs) {
    const { bodyA, bodyB } = pair;

    if (
      bodyA.fruitTier !== undefined &&
      bodyB.fruitTier !== undefined &&
      bodyA.label === bodyB.label &&
      !bodyA.removing &&
      !bodyB.removing
    ) {
      bodyA.removing = true;
      bodyB.removing = true;

      // Make bodies sensors so they stop physically interacting
      bodyA.isSensor = true;
      bodyB.isSensor = true;

      pendingMerges.push({ bodyA, bodyB, tier: bodyA.fruitTier });
    }
  }
});
```

Setting `isSensor = true` on flagged bodies means Matter.js will still detect them for collision callbacks but won't apply physical forces to/from them. This prevents ghost collisions between a merging body and its neighbors.

### 5. Renderer: Skip Sensor Bodies

**File**: `src/renderer.js` — `drawFruits()`

The renderer already skips bodies with `body.removing === true`, so no change needed. The sensor flag is purely for physics behavior.

### Architecture Summary

```
No new files. Changes to existing modules:

src/constants.js    — Updated physics values, add density scaling constants
src/physics.js      — Per-tier density in createFruitBody()
src/game.js         — Delta clamping in loop()
src/merger.js       — Set isSensor on merging bodies
```

## User Experience

- Fruits drop faster and settle more quickly (stronger gravity)
- Large fruits feel heavier and push small fruits aside
- Collisions have slightly more bounce, feeling more responsive
- Merges are cleaner — no "phantom" collisions from disappearing fruits
- Stacked fruits stay stable instead of slowly sliding apart
- Lag spikes no longer cause fruits to teleport through walls

## Testing Strategy

### Unit Tests

- **`constants.test.js`**: Verify BASE_DENSITY and DENSITY_SCALE_PER_TIER produce reasonable values for all 11 tiers (density always positive, monotonically increasing)
- **`physics.test.js`** (update existing): Verify `createFruitBody()` applies tier-scaled density. Test that tier-0 density < tier-10 density.

### Integration Tests

- **Delta clamping test**: Simulate a 100ms delta, verify the engine only advances by 20ms worth of physics
- **Sensor flag test**: Create two same-tier bodies, trigger merge detection, verify both bodies have `isSensor === true` after collision
- **No cascade merge test**: After flagging bodies as removing/sensor, verify they don't trigger additional merge events with neighboring bodies

### Manual Testing

- Play through a full game and verify:
  - Fruits no longer feel floaty
  - Large fruits settle firmly
  - Merges are clean without visual glitches
  - No fruits escape the container walls during lag
  - Chain merges (merge produces a fruit that immediately merges again) still work correctly

## Performance Considerations

- Tier-scaled density has zero performance cost (one multiplication per fruit creation)
- Setting `isSensor` on merging bodies reduces physics workload (engine skips force resolution for sensors)
- Delta clamping prevents runaway physics computation on lag frames
- No new per-frame allocations or computation added

## Security Considerations

No security implications — all changes are to client-side physics tuning constants and game logic.

## Documentation

No documentation changes needed. The README setup instructions and gameplay description remain the same.

## Implementation Phases

### Phase 1: Core Fixes

1. Update `src/constants.js` with new physics values and density scaling constants
2. Update `src/physics.js` to apply per-tier density in `createFruitBody()`
3. Update `src/game.js` to clamp delta time in `loop()`
4. Update `src/merger.js` to set `isSensor = true` on merging bodies
5. Update existing tests and add new ones
6. Manual playtest to verify feel

### Phase 2: Fine-Tuning (if needed)

1. Adjust gravity, restitution, friction values based on playtesting
2. Consider adding `sleepThreshold` to Matter.js engine to let settled bodies sleep (performance optimization)
3. Tune density scaling curve if large fruits feel too heavy or too light

## Open Questions

1. **Exact density curve**: Linear scaling (`BASE + SCALE * tier`) is proposed. Would exponential scaling feel better for the largest fruits? Needs playtesting.
2. **Sleep threshold**: Should settled fruits use Matter.js sleeping to improve performance with many bodies? This could cause "delayed wakeup" artifacts but would improve stability of stacks.
3. **Restitution per tier**: Should larger fruits be less bouncy (lower restitution) than smaller ones? This would make large fruits feel more "solid" but adds complexity.

## References

- [Matter.js Body Properties](https://brm.io/matter-js/docs/classes/Body.html)
- [Matter.js isSensor documentation](https://brm.io/matter-js/docs/classes/Body.html#property_isSensor)
- [Matter.js Engine.update delta parameter](https://brm.io/matter-js/docs/classes/Engine.html#method_update)
- [Phaser 3 Suika implementation (reference)](https://github.com/Coteh/suika-clone) — Uses same Matter.js deferred-removal pattern
- [TomboFry/suika-game](https://github.com/TomboFry/suika-game) — Vanilla JS + Matter.js reference
- [Original Suika Game spec](./feat-suika-game.md)
