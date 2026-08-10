import Phaser from "phaser";
import { UI } from "../config/constants";

/**
 * Placeholder heart display (step 8) — one Rectangle per max-HP point.
 * Swap the rectangles for real Gemini-generated heart icons at step 9;
 * setHealth's fill/color logic stays the same either way.
 */
export class HUD {
  private readonly hearts: Phaser.GameObjects.Rectangle[] = [];
  private readonly scoreText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number, maxHp: number) {
    for (let i = 0; i < maxHp; i++) {
      const heartX = x + i * (UI.heartSize + UI.heartSpacing);
      const heart = scene.add
        .rectangle(heartX, y, UI.heartSize, UI.heartSize, UI.heartFilledColor)
        .setOrigin(0, 0)
        .setScrollFactor(0);
      this.hearts.push(heart);
    }

    const scoreX = x + maxHp * (UI.heartSize + UI.heartSpacing) + 16;
    this.scoreText = scene.add
      .text(scoreX, y, "Score: 0", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#ffffff",
      })
      .setOrigin(0, 0)
      .setScrollFactor(0);
  }

  setHealth(current: number): void {
    this.hearts.forEach((heart, i) => {
      heart.setFillStyle(i < current ? UI.heartFilledColor : UI.heartEmptyColor);
    });
  }

  setScore(score: number): void {
    this.scoreText.setText(`Score: ${score}`);
  }
}
