import { FRUITS } from './fruits.js';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  CONTAINER_WIDTH,
  CONTAINER_X,
  CONTAINER_Y,
  CONTAINER_HEIGHT,
  WALL_THICKNESS,
  DANGER_LINE_Y,
  PANEL_WIDTH,
  PANEL_GAP,
} from './constants.js';

export function createCanvas() {
  const canvas = document.getElementById('game-canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext('2d');
  return { canvas, ctx };
}

export function render(ctx, bodies, state) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  drawBackground(ctx);
  drawContainer(ctx);
  drawDangerLine(ctx);
  drawFruits(ctx, bodies);
  drawNextFruitPreview(ctx, state);
  drawNextFruitPanel(ctx, state);
  drawScore(ctx, state.score);

  if (state.isGameOver) {
    drawGameOverOverlay(ctx, state.score);
  }
}

function drawBackground(ctx) {
  ctx.fillStyle = '#FFF8E7';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawContainer(ctx) {
  ctx.fillStyle = '#8B7355';
  // Left wall
  ctx.fillRect(
    CONTAINER_X - WALL_THICKNESS,
    CONTAINER_Y,
    WALL_THICKNESS,
    CONTAINER_HEIGHT + WALL_THICKNESS
  );
  // Right wall
  ctx.fillRect(
    CONTAINER_X + CONTAINER_WIDTH,
    CONTAINER_Y,
    WALL_THICKNESS,
    CONTAINER_HEIGHT + WALL_THICKNESS
  );
  // Floor
  ctx.fillRect(
    CONTAINER_X - WALL_THICKNESS,
    CONTAINER_Y + CONTAINER_HEIGHT,
    CONTAINER_WIDTH + WALL_THICKNESS * 2,
    WALL_THICKNESS
  );

  // Inner background
  ctx.fillStyle = '#FFFDF5';
  ctx.fillRect(CONTAINER_X, CONTAINER_Y, CONTAINER_WIDTH, CONTAINER_HEIGHT);
}

function drawDangerLine(ctx) {
  ctx.save();
  ctx.setLineDash([8, 6]);
  ctx.strokeStyle = '#E74C3C';
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.moveTo(CONTAINER_X, DANGER_LINE_Y);
  ctx.lineTo(CONTAINER_X + CONTAINER_WIDTH, DANGER_LINE_Y);
  ctx.stroke();
  ctx.restore();
}

function drawFruitCircle(ctx, fruit, x, y, radius) {
  const r = radius ?? fruit.radius;

  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fruit.color;
  ctx.fill();

  ctx.strokeStyle = darkenColor(fruit.color, 0.2);
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold ${Math.max(10, r * 0.6)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(fruit.name.slice(0, 2), x, y);
}

function drawFruits(ctx, bodies) {
  for (const body of bodies) {
    if (body.fruitTier === undefined || body.removing) continue;
    const fruit = FRUITS[body.fruitTier];
    drawFruitCircle(ctx, fruit, body.position.x, body.position.y);
  }
}

function drawNextFruitPreview(ctx, state) {
  if (state.isGameOver) return;

  const fruit = FRUITS[state.nextFruitTier];
  const x = state.cursorX;
  const y = CONTAINER_Y - fruit.radius - 10;

  ctx.save();
  ctx.globalAlpha = state.isDropCooldown ? 0.3 : 0.7;

  drawFruitCircle(ctx, fruit, x, y);

  // Drop guide line
  if (!state.isDropCooldown) {
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y + fruit.radius);
    ctx.lineTo(x, CONTAINER_Y + CONTAINER_HEIGHT);
    ctx.stroke();
  }

  ctx.restore();
}

function drawNextFruitPanel(ctx, state) {
  if (state.isGameOver) return;

  const panelX = CONTAINER_X + CONTAINER_WIDTH + WALL_THICKNESS + PANEL_GAP;
  const panelY = CONTAINER_Y;
  const panelSize = PANEL_WIDTH;

  ctx.fillStyle = '#FFFDF5';
  ctx.strokeStyle = '#8B7355';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(panelX, panelY, panelSize, panelSize + 20, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#8B7355';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('NEXT', panelX + panelSize / 2, panelY + 4);

  const fruit = FRUITS[state.nextFruitTier];
  const previewRadius = Math.min(fruit.radius, 22);
  const cx = panelX + panelSize / 2;
  const cy = panelY + 46;

  drawFruitCircle(ctx, fruit, cx, cy, previewRadius);
}

function drawScore(ctx, score) {
  ctx.fillStyle = '#2C3E50';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(`Score: ${score}`, CONTAINER_X + CONTAINER_WIDTH / 2, 10);
}

function drawGameOverOverlay(ctx, score) {
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 48px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Game Over', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);

  ctx.font = 'bold 32px sans-serif';
  ctx.fillText(`Score: ${score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);

  ctx.font = '20px sans-serif';
  ctx.fillStyle = '#CCCCCC';
  ctx.fillText('Click to Restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 70);
  ctx.restore();
}

function darkenColor(hex, amount) {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.max(0, ((num >> 16) & 0xff) * (1 - amount)) | 0;
  const g = Math.max(0, ((num >> 8) & 0xff) * (1 - amount)) | 0;
  const b = Math.max(0, (num & 0xff) * (1 - amount)) | 0;
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}
