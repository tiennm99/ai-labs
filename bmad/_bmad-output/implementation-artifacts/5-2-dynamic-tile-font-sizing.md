# Story 5.2: Dynamic Tile Font Sizing

Status: done

## Story

As a player,
I want tile numbers to be clearly readable at any value,
so that I can always see tile values regardless of digit count.

## Acceptance Criteria

1. Given a tile with a 1-digit value (2, 4, 8), when it renders, then the font size is 55px bold (desktop) / 30px bold (mobile)
2. Given a tile with a 2-digit value (16, 32, 64), when it renders, then the font size is 45px bold (desktop) / 25px bold (mobile)
3. Given a tile with a 3-digit value (128, 256, 512), when it renders, then the font size is 35px bold (desktop) / 20px bold (mobile)
4. Given a tile with a 4-digit value (1024, 2048, 4096, 8192), when it renders, then the font size is 25px bold (desktop) / 14px bold (mobile)
5. Given a tile with a 5+ digit value (16384, 32768, 65536), when it renders, then the font size is 15px bold (desktop) / proportionally scaled (mobile)

## Tasks / Subtasks

- [x] Task 1: Already implemented in Story 4.3 (Responsive Layout)
  - [x] Tile.svelte derives digitCount from String(value).length
  - [x] Maps to CSS variables var(--tile-font-1) through var(--tile-font-5)
  - [x] Desktop: 55/45/35/25/15px; Mobile: 30/25/20/14/10px via @media (max-width: 520px) override in app.css

## Dev Notes

This story's requirements were fully implemented as part of Story 4.3 (Responsive Layout) since dynamic font sizing was a necessary component of the responsive breakpoint implementation. All ACs are satisfied by the existing code.

### File List
- No additional changes needed — implemented in Story 4.3 commit

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6 (1M context)

### Completion Notes List
- All ACs already satisfied by Story 4.3 implementation
- Tile.svelte has digit-count-based font sizing with responsive CSS variables
