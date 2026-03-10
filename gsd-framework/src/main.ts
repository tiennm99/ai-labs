// Main entry point for the Pikachu Match game
// Temporary placeholder - will be updated when CONFIG is available

// Get canvas element by id 'game'
const canvas = document.getElementById('game') as HTMLCanvasElement;
if (!canvas) {
  throw new Error('Canvas element with id "game" not found');
}

// Get 2D context
const ctx = canvas.getContext('2d');
if (!ctx) {
  throw new Error('Could not get 2D context from canvas');
}

// Set canvas size (hardcoded for now: 16 cols * 52, 10 rows * 52)
// 52 = 48 (tile size) + 4 (gap)
const canvasWidth = 16 * 52; // 832
const canvasHeight = 10 * 52; // 520
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Fill with background color (hardcoded for now: '#1a1a2e')
ctx.fillStyle = '#1a1a2e';
ctx.fillRect(0, 0, canvasWidth, canvasHeight);

console.log('Pikachu Match game initialized');
console.log(`Canvas size: ${canvasWidth}x${canvasHeight}`);
