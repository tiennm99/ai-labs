<script>
  let { score = 0, bestScore = 0 } = $props();
</script>

<div class="flex gap-2">
  <div class="flex flex-col items-center rounded-[3px] px-6 py-2 min-w-[80px]" style="background: #bbada0;">
    <span class="uppercase text-[13px] font-bold" style="color: #eee4da;">Score</span>
    <span class="text-[25px] font-bold" style="color: #f9f6f2;" aria-live="polite">{score}</span>
  </div>
  <div class="flex flex-col items-center rounded-[3px] px-6 py-2 min-w-[80px]" style="background: #bbada0;">
    <span class="uppercase text-[13px] font-bold" style="color: #eee4da;">Best</span>
    <span class="text-[25px] font-bold" style="color: #f9f6f2;">{bestScore}</span>
  </div>
</div>
