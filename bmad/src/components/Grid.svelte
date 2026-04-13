<script>
  import Tile from './Tile.svelte';
  import { GRID_SIZE } from '../lib/constants.js';

  let { tiles = [] } = $props();

  const GAP = 15;
  const CELL_SIZE = 106.25;
  const CONTAINER_SIZE = GRID_SIZE * CELL_SIZE + (GRID_SIZE + 1) * GAP;
</script>

<div
  class="relative mx-auto rounded-[6px]"
  style="
    width: {CONTAINER_SIZE}px;
    height: {CONTAINER_SIZE}px;
    background: #bbada0;
    padding: {GAP}px;
  "
  role="grid"
  aria-label="Game board"
>
  <!-- Empty cell placeholders -->
  {#each Array(GRID_SIZE * GRID_SIZE) as _, i}
    {@const row = Math.floor(i / GRID_SIZE)}
    {@const col = i % GRID_SIZE}
    <div
      class="absolute rounded-[3px]"
      style="
        width: {CELL_SIZE}px;
        height: {CELL_SIZE}px;
        transform: translate({col * (CELL_SIZE + GAP)}px, {row * (CELL_SIZE + GAP)}px);
        background: #cdc1b4;
      "
    ></div>
  {/each}

  <!-- Tiles -->
  {#each tiles as tile (tile.id)}
    <Tile value={tile.value} row={tile.row} col={tile.col} isNew={tile.isNew} isMerged={tile.isMerged} />
  {/each}
</div>
