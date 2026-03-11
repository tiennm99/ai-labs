// src/config.ts - Game configuration constants
// All game constants in one place, easily tunable

export const CONFIG = {
  grid: {
    rows: 10,
    cols: 16,
    totalTiles: 160,
    pairsPerType: 10,
  },
  tile: {
    size: 48,
    gap: 4,
    cornerRadius: 8,
  },
  emojis: [
    '🌟', '⭐', '💫', '✨', '🌙', '☀️', '🔥', '💧',
    '🌿', '⚡', '🧊', '🪨', '🌸', '🍃', '🌊', '🍄'
  ],
  colors: {
    background: '#1a1a2e',
    tile: '#16213e',
    tileHover: '#0f3460',
    selection: '#e94560',
    text: '#eaeaea',
  },
  animation: {
    matchDuration: 250, // ms - scale+fade duration per CONTEXT.md
  },
} as const;
