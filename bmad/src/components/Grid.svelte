<script>
  import Tile from './Tile.svelte';
  import { GRID_SIZE } from '../lib/constants.js';

  let { tiles = [] } = $props();
</script>

<div
  class="relative mx-auto rounded-[6px]"
  style="
    width: var(--container-size);
    height: var(--container-size);
    background: #bbada0;
    padding: var(--grid-padding);
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
        width: var(--cell-size);
        height: var(--cell-size);
        transform: translate(calc({col} * (var(--cell-size) + var(--grid-gap))), calc({row} * (var(--cell-size) + var(--grid-gap))));
        background: #cdc1b4;
      "
    ></div>
  {/each}

  <!-- Tiles -->
  {#each tiles as tile (tile.id)}
    <Tile value={tile.value} row={tile.row} col={tile.col} isNew={tile.isNew} isMerged={tile.isMerged} />
  {/each}
</div>
