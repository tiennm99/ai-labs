<script>
  import Grid from './components/Grid.svelte';
  import ScoreBoard from './components/ScoreBoard.svelte';
  import GameMessage from './components/GameMessage.svelte';
  import { initGame, move, isGameOver } from './lib/game-logic.js';
  import { GRID_SIZE } from './lib/constants.js';
  import { getDirectionFromKey } from './lib/input-handler.js';
  import { saveGameState, loadGameState, saveBestScore, loadBestScore, clearGameState } from './lib/storage.js';
  import { createTilesFromGrid, computeTilesAfterMove, resetTracker } from './lib/tile-tracker.js';

  const SLIDE_DURATION = 100;
  const savedState = loadGameState();
  let gameState = $state(savedState || initGame());
  let bestScore = $state(Math.max(loadBestScore(), savedState?.score || 0));
  let tiles = $state(createTilesFromGrid(gameState.grid));
  let scoreDelta = $state(0);
  let isAnimating = $state(false);
  let queuedDirection = $state(null);
  let reducedMotion = $state(false);

  if (typeof window !== 'undefined') {
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  $effect(() => {
    saveGameState(gameState);
  });

  $effect(() => {
    if (gameState.score > bestScore) {
      bestScore = gameState.score;
    }
    saveBestScore(bestScore);
  });

  let overlayType = $derived.by(() => {
    if (gameState.won && !gameState.keepPlaying) return 'win';
    if (isGameOver(gameState)) return 'gameover';
    return null;
  });

  function executeMove(direction) {
    if (overlayType === 'gameover') return;

    const prevGrid = gameState.grid;
    const newState = move(gameState, direction);
    if (newState === gameState) return;

    scoreDelta = newState.score - gameState.score;
    tiles = computeTilesAfterMove(tiles, prevGrid, newState.grid, direction);
    gameState = newState;

    if (reducedMotion) return;

    isAnimating = true;
    setTimeout(() => {
      isAnimating = false;
      if (queuedDirection) {
        const next = queuedDirection;
        queuedDirection = null;
        executeMove(next);
      }
    }, SLIDE_DURATION);
  }

  function handleNewGame() {
    clearGameState();
    resetTracker();
    gameState = initGame();
    tiles = createTilesFromGrid(gameState.grid);
  }

  function handleKeepGoing() {
    gameState = { ...gameState, keepPlaying: true, won: true };
  }

  function handleKeydown(event) {
    const direction = getDirectionFromKey(event.key);
    if (!direction) return;
    event.preventDefault();

    if (isAnimating) {
      queuedDirection = direction;
      return;
    }

    executeMove(direction);
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<main class="max-w-[500px] mx-auto px-2 pt-6" role="application">
  <header>
    <div class="flex items-center justify-between mb-2">
      <h1 class="text-[80px] font-bold leading-none" style="color: #776e65;">2048</h1>
      <ScoreBoard score={gameState.score} {bestScore} {scoreDelta} />
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
