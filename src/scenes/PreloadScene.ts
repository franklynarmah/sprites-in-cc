import Phaser from "phaser";
import { TILE_SIZE } from "../config/constants";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("Preload");
  }

  preload(): void {
    // Real Gemini-generated sprites get loaded here later (see plan Section 6).
  }

  create(): void {
    this.generatePlaceholderTileTexture();
    this.scene.start("MainMenu");
  }

  private generatePlaceholderTileTexture(): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x4a4e9c, 1);
    graphics.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
    graphics.lineStyle(1, 0x6a6ed0, 1);
    graphics.strokeRect(0, 0, TILE_SIZE, TILE_SIZE);
    graphics.generateTexture("tile-solid", TILE_SIZE, TILE_SIZE);
    graphics.destroy();
  }
}
