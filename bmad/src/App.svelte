<script>
  import Grid from './components/Grid.svelte';
  import ScoreBoard from './components/ScoreBoard.svelte';
  import GameMessage from './components/GameMessage.svelte';
  import { initGame, move, isGameOver } from './lib/game-logic.js';
  import { GRID_SIZE } from './lib/constants.js';
  import { getDirectionFromKey } from './lib/input-handler.js';
  import { saveGameState, loadGameState, saveBestScore, loadBestScore, clearGameState } from './lib/storage.js';

  const savedState = loadGameState();
  let gameState = $state(savedState || initGame());
  let bestScore = $state(Math.max(loadBestScore(), savedState?.score || 0));

  $effect(() => {
    saveGameState(gameState);
  });

  $effect(() => {
    if (gameState.score > bestScore) {
      bestScore = gameState.score;
    }
    saveBestScore(bestScore);
  });

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

  let overlayType = $derived.by(() => {
    if (gameState.won && !gameState.keepPlaying) return 'win';
    if (isGameOver(gameState)) return 'gameover';
    return null;
  });

  function handleNewGame() {
    clearGameState();
    gameState = initGame();
  }

  function handleKeepGoing() {
    gameState = { ...gameState, keepPlaying: true, won: true };
  }

  function handleKeydown(event) {
    const direction = getDirectionFromKey(event.key);
    if (!direction) return;
    event.preventDefault();

    if (overlayType === 'gameover') return;

    const newState = move(gameState, direction);
    if (newState !== gameState) {
      gameState = newState;
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<main class="max-w-[500px] mx-auto px-2 pt-6" role="application">
  <header>
    <div class="flex items-center justify-between mb-2">
      <h1 class="text-[80px] font-bold leading-none" style="color: #776e65;">2048</h1>
      <ScoreBoard score={gameState.score} {bestScore} />
    </div>
    <div class="flex items-center justify-between mb-4">
      <p class="text-[18px]" style="color: #776e65;">Join the numbers and get to the <strong>2048 tile!</strong></p>
      <button
        class="font-bold text-[18px] rounded-[3px] px-4 py-2 min-h-[44px] min-w-[44px] cursor-pointer"
        style="background: #8f7a66; color: #f9f6f2;"
        onclick={handleNewGame}
      >
        New Game
      </button>
    </div>
  </header>
  <div class="relative">
    <Grid {tiles} />
    <GameMessage type={overlayType} onKeepGoing={handleKeepGoing} onNewGame={handleNewGame} />
  </div>
</main>
