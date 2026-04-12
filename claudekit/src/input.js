import { FRUITS } from './fruits.js';
import { CONTAINER_X, CONTAINER_WIDTH } from './constants.js';

export function clampX(x, fruitTier) {
  const radius = FRUITS[fruitTier].radius;
  const minX = CONTAINER_X + radius;
  const maxX = CONTAINER_X + CONTAINER_WIDTH - radius;
  return Math.max(minX, Math.min(maxX, x));
}

export function setupInput(canvas, game) {
  function getCanvasX(clientX) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    return (clientX - rect.left) * scaleX;
  }

  canvas.addEventListener('mousemove', (e) => {
    game.setCursorX(getCanvasX(e.clientX));
  });

  canvas.addEventListener('click', (e) => {
    if (game.state.isGameOver) {
      game.restart();
    } else {
      game.drop();
    }
  });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    game.setCursorX(getCanvasX(touch.clientX));
  }, { passive: false });

  canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    if (game.state.isGameOver) {
      game.restart();
    } else {
      game.drop();
    }
  }, { passive: false });
}
