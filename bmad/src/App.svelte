<script>
  import Grid from './components/Grid.svelte';
  import { initGame } from './lib/game-logic.js';
  import { GRID_SIZE } from './lib/constants.js';

  let gameState = $state(initGame());

  let tiles = $derived.by(() => {
    const result = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const value = gameState.grid[row][col];
        if (value !== 0) {
          result.push({ value, row, col });
        }
      }
    }
    return result;
  });
</script>

<main class="max-w-[500px] mx-auto pt-10">
  <Grid {tiles} />
</main>
