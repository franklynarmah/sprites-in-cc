import Phaser from "phaser";
import { UI } from "../config/constants";

/**
 * Placeholder heart display (step 8) — one Rectangle per max-HP point.
 * Swap the rectangles for real Gemini-generated heart icons at step 9;
 * setHealth's fill/color logic stays the same either way.
 */
export class HUD {
  private readonly hearts: Phaser.GameObjects.Rectangle[] = [];

  constructor(scene: Phaser.Scene, x: number, y: number, maxHp: number) {
    for (let i = 0; i < maxHp; i++) {
      const heartX = x + i * (UI.heartSize + UI.heartSpacing);
      const heart = scene.add
        .rectangle(heartX, y, UI.heartSize, UI.heartSize, UI.heartFilledColor)
        .setOrigin(0, 0)
        .setScrollFactor(0);
      this.hearts.push(heart);
    }
  }

  setHealth(current: number): void {
    this.hearts.forEach((heart, i) => {
      heart.setFillStyle(i < current ? UI.heartFilledColor : UI.heartEmptyColor);
    });
  }
}
