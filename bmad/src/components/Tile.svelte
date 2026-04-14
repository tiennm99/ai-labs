<script>
  import { TILE_COLORS } from '../lib/constants.js';

  let { value, row, col, isNew = false, isMerged = false } = $props();

  let colors = $derived(TILE_COLORS[value] || TILE_COLORS.super);

  let digitCount = $derived(String(value).length);
  let fontSize = $derived(
    digitCount <= 1 ? 'var(--tile-font-1)' :
    digitCount === 2 ? 'var(--tile-font-2)' :
    digitCount === 3 ? 'var(--tile-font-3)' :
    digitCount === 4 ? 'var(--tile-font-4)' :
    'var(--tile-font-5)'
  );

  let glow = $derived(value >= 128 ? '0 0 30px 10px rgba(243, 215, 116, 0.4)' : 'none');

  let animation = $derived(
    isNew ? 'tile-pop 200ms ease-in-out' :
    isMerged ? 'tile-merge 200ms ease-in-out' :
    'none'
  );
</script>

<div
  class="absolute flex items-center justify-center font-bold rounded-[3px]"
  style="
    width: var(--cell-size);
    height: var(--cell-size);
    translate: calc({col} * (var(--cell-size) + var(--grid-gap))) calc({row} * (var(--cell-size) + var(--grid-gap)));
    transition: translate 100ms ease-in-out;
    animation: {animation};
    background: {colors.bg};
    color: {colors.text};
    font-size: {fontSize};
    box-shadow: {glow};
  "
  role="gridcell"
  aria-label="Tile: {value}"
>
  {value}
</div>
