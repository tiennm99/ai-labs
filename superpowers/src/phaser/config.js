import Phaser from "phaser";
import { PreloadScene } from "./scenes/PreloadScene";
import { GameScene } from "./scenes/GameScene";

/**
 * @param {HTMLElement} parent
 * @param {number} width
 * @param {number} height
 * @returns {Phaser.Types.Core.GameConfig}
 */
export function createPhaserConfig(parent, width, height) {
  return {
    type: Phaser.AUTO,
    parent,
    width,
    height,
    backgroundColor: "#16213e",
    scene: [PreloadScene, GameScene],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
  };
}
