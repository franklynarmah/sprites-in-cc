import Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH } from "../config/constants";
import { SaveState } from "../systems/SaveState";

type Outcome = "win" | "lose";

export class GameOverScene extends Phaser.Scene {
  private outcome: Outcome = "lose";

  constructor() {
    super("GameOver");
  }

  init(data: { outcome: Outcome }): void {
    this.outcome = data.outcome;
  }

  create(): void {
    const isWin = this.outcome === "win";
    this.cameras.main.setBackgroundColor(isWin ? "#1f4d2b" : "#4d1f1f");

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20, isWin ? "LEVEL COMPLETE" : "YOU DIED", {
        fontFamily: "monospace",
        fontSize: "32px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.add
      .text(
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2 + 24,
        `Press SPACE to ${isWin ? "play again" : "retry"}`,
        {
          fontFamily: "monospace",
          fontSize: "16px",
          color: "#cccccc",
        },
      )
      .setOrigin(0.5);

    this.input.keyboard!.once("keydown-SPACE", () => {
      if (isWin) {
        SaveState.reset();
      }
      this.scene.start("Game");
    });
  }
}
