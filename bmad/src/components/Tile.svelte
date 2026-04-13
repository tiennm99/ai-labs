<script>
  import { TILE_COLORS } from '../lib/constants.js';

  let { value, row, col } = $props();

  let colors = $derived(TILE_COLORS[value] || TILE_COLORS.super);

  const GAP = 15;
  const CELL_SIZE = 106.25;

  let x = $derived(col * (CELL_SIZE + GAP));
  let y = $derived(row * (CELL_SIZE + GAP));
</script>

<div
  class="absolute flex items-center justify-center font-bold rounded-[3px]"
  style="
    width: {CELL_SIZE}px;
    height: {CELL_SIZE}px;
    transform: translate({x}px, {y}px);
    background: {colors.bg};
    color: {colors.text};
    font-size: 55px;
  "
  role="gridcell"
  aria-label="Tile: {value}"
>
  {value}
</div>
