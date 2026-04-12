import { createCanvas } from './renderer.js';
import { setupInput } from './input.js';
import { Game } from './game.js';
import './style.css';

const { ctx, canvas } = createCanvas();
const game = new Game(ctx);
setupInput(canvas, game);
game.start();
