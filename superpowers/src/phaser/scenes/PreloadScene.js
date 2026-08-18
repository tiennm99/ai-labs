import Phaser from "phaser";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }

  /** @returns {void} */
  preload() {
    // No assets to load — emoji are rendered as text
  }

  /** @returns {void} */
  create() {
    this.scene.start("GameScene");
  }
}
