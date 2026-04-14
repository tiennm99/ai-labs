<script>
  let { type = null, onKeepGoing = () => {}, onNewGame = () => {} } = $props();

  let message = $derived(type === 'win' ? 'You win!' : 'Game over!');
  let bgColor = $derived(type === 'win' ? 'rgba(237, 194, 46, 0.5)' : 'rgba(238, 228, 218, 0.73)');
</script>

{#if type}
  <div
    class="absolute inset-0 flex flex-col items-center justify-center z-10 rounded-[6px]"
    style="background: {bgColor}; animation: overlay-fade 800ms ease-in-out;"
    role="alertdialog"
    aria-modal="true"
    aria-label={message}
  >
    <p class="font-bold mb-4" style="color: #776e65; font-size: var(--overlay-msg-size);">{message}</p>
    {#if type === 'win'}
      <div class="flex gap-2">
        <button
          class="font-bold text-[18px] rounded-[3px] px-5 py-3 min-h-[44px] cursor-pointer"
          style="background: #8f7a66; color: #f9f6f2;"
          onclick={onKeepGoing}
        >
          Keep going
        </button>
        <button
          class="font-bold text-[18px] rounded-[3px] px-5 py-3 min-h-[44px] cursor-pointer"
          style="background: #8f7a66; color: #f9f6f2;"
          onclick={onNewGame}
        >
          New Game
        </button>
      </div>
    {:else}
      <button
        class="font-bold text-[18px] rounded-[3px] px-5 py-3 min-h-[44px] cursor-pointer"
        style="background: #8f7a66; color: #f9f6f2;"
        onclick={onNewGame}
      >
        Try again
      </button>
    {/if}
  </div>
{/if}
