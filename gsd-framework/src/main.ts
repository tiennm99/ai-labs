// Main entry point for the Pikachu Match game
// This file initializes the Game class and starts the game loop

import { Game } from './game/Game';

let game: Game | null = null;

document.addEventListener('DOMContentLoaded', () => {
  try {
    game = new Game();

    // Handle errors
    game.events.on('error', (err) => {
      console.error('Game error:', err);
    });

    // Log tick events in development (comment out in production)
    game.events.on('game:tick', (_data) => {
      // Uncomment for debugging: console.log('Tick:', _data.deltaTime.toFixed(2), 'ms');
    });

    game.start();
    console.log('Game initialized - Canvas should show with background color');
  } catch (err) {
    console.error('Failed to initialize game:', err);
  }
});
