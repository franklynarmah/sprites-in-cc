import Phaser from "phaser";
import { TILE_SIZE } from "../config/constants";
import { PLAYER_ANIMATIONS, PLAYER_SPRITE_SOURCES } from "../config/assets";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("Preload");
  }

  preload(): void {
    for (const [key, url] of Object.entries(PLAYER_SPRITE_SOURCES)) {
      this.load.image(key, url);
    }
  }

  create(): void {
    this.generatePlaceholderTileTexture();
    this.createPlayerAnimations();
    this.scene.start("MainMenu");
  }

  private createPlayerAnimations(): void {
    const idle = PLAYER_ANIMATIONS.idle;
    this.anims.create({
      key: idle.key,
      frames: idle.frameKeys.map((key) => ({ key })),
      frameRate: idle.frameRate,
      repeat: idle.repeat,
    });
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
