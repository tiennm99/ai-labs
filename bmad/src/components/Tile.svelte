<script>
  import { TILE_COLORS } from '../lib/constants.js';

  let { value, row, col, isNew = false, isMerged = false } = $props();

  let colors = $derived(TILE_COLORS[value] || TILE_COLORS.super);

  const GAP = 15;
  const CELL_SIZE = 106.25;

  let x = $derived(col * (CELL_SIZE + GAP));
  let y = $derived(row * (CELL_SIZE + GAP));

  let animation = $derived(
    isNew ? 'tile-pop 200ms ease-in-out' :
    isMerged ? 'tile-merge 200ms ease-in-out' :
    'none'
  );
</script>

<div
  class="absolute flex items-center justify-center font-bold rounded-[3px]"
  style="
    width: {CELL_SIZE}px;
    height: {CELL_SIZE}px;
    transform: translate({x}px, {y}px);
    transition: transform 100ms ease-in-out;
    animation: {animation};
    background: {colors.bg};
    color: {colors.text};
    font-size: 55px;
  "
  role="gridcell"
  aria-label="Tile: {value}"
>
  {value}
</div>
