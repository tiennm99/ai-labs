<script>
  let { score = 0, bestScore = 0, scoreDelta = 0 } = $props();

  let floats = $state([]);
  let floatId = 0;

  $effect(() => {
    if (scoreDelta > 0) {
      const id = ++floatId;
      floats = [...floats, { id, value: scoreDelta }];
      setTimeout(() => {
        floats = floats.filter(f => f.id !== id);
      }, 600);
    }
  });
</script>

<div class="flex gap-2">
  <div class="relative flex flex-col items-center rounded-[3px] px-6 py-2 min-w-[80px]" style="background: #bbada0;">
    <span class="uppercase text-[13px] font-bold" style="color: #eee4da;">Score</span>
    <span class="font-bold" style="color: #f9f6f2; font-size: var(--score-value-size);" aria-live="polite">{score}</span>
    {#each floats as float (float.id)}
      <span
        class="absolute font-bold text-[18px] pointer-events-none"
        style="color: rgba(119, 110, 101, 0.9); top: -10px; animation: score-float 600ms ease-out forwards;"
      >
        +{float.value}
      </span>
    {/each}
  </div>
  <div class="flex flex-col items-center rounded-[3px] px-6 py-2 min-w-[80px]" style="background: #bbada0;">
    <span class="uppercase text-[13px] font-bold" style="color: #eee4da;">Best</span>
    <span class="font-bold" style="color: #f9f6f2; font-size: var(--score-value-size);">{bestScore}</span>
  </div>
</div>
