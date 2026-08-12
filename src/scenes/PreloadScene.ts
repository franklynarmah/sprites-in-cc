import Phaser from "phaser";
import { TILE_SIZE } from "../config/constants";
import {
  ENEMY_ANIMATIONS,
  ENEMY_SPRITE_SOURCES,
  PLAYER_ANIMATIONS,
  PLAYER_SPRITE_SOURCES,
} from "../config/assets";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("Preload");
  }

  preload(): void {
    for (const [key, url] of Object.entries(PLAYER_SPRITE_SOURCES)) {
      this.load.image(key, url);
    }
    for (const [key, url] of Object.entries(ENEMY_SPRITE_SOURCES)) {
      this.load.image(key, url);
    }
  }

  create(): void {
    this.generatePlaceholderTileTexture();
    this.createPlayerAnimations();
    this.createEnemyAnimations();
    this.scene.start("MainMenu");
  }

  private createPlayerAnimations(): void {
    for (const anim of Object.values(PLAYER_ANIMATIONS)) {
      this.anims.create({
        key: anim.key,
        frames: anim.frameKeys.map((key) => ({ key })),
        frameRate: anim.frameRate,
        repeat: anim.repeat,
      });
    }
  }

  private createEnemyAnimations(): void {
    for (const anim of Object.values(ENEMY_ANIMATIONS)) {
      this.anims.create({
        key: anim.key,
        frames: anim.frameKeys.map((key) => ({ key })),
        frameRate: anim.frameRate,
        repeat: anim.repeat,
      });
    }
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
