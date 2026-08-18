import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { createPhaserConfig } from "../phaser/config";
import { GameStateManager } from "../game/state";

/** @typedef {import("../types").Difficulty} Difficulty */

/**
 * @typedef {Object} GameContainerProps
 * @property {Difficulty} difficulty
 * @property {GameStateManager} stateManager
 * @property {() => void} onGameOver
 */

/**
 * @param {GameContainerProps} props
 * @returns {import("react").JSX.Element}
 */
export function GameContainer({ difficulty, stateManager, onGameOver }) {
  const containerRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const gameRef = useRef(/** @type {Phaser.Game | null} */ (null));

  useEffect(() => {
    if (!containerRef.current) return;

    const config = createPhaserConfig(containerRef.current, 800, 600);
    const game = new Phaser.Game(config);
    gameRef.current = game;

    // Pass data to Phaser scenes via the registry
    game.registry.set("difficulty", difficulty);
    game.registry.set("stateManager", stateManager);

    // Listen for game over
    const handleStateChange = () => {
      const state = stateManager.getState();
      if (state.status === "won" || state.status === "lost") {
        onGameOver();
      }
    };
    stateManager.on("stateChange", handleStateChange);

    return () => {
      stateManager.off("stateChange", handleStateChange);
      game.destroy(true);
      gameRef.current = null;
    };
  }, [difficulty, stateManager, onGameOver]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "800px",
        height: "600px",
        margin: "0 auto",
      }}
    />
  );
}
