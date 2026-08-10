import Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH, UI } from "../config/constants";
import { SaveState } from "../systems/SaveState";

export class PauseScene extends Phaser.Scene {
  constructor() {
    super("Pause");
  }

  create(): void {
    this.add
      .rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, UI.overlayColor, UI.overlayAlpha)
      .setOrigin(0, 0)
      .setScrollFactor(0);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40, "PAUSED", {
        fontFamily: "monospace",
        fontSize: "32px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 10, "SPACE / ESC: Resume", {
        fontFamily: "monospace",
        fontSize: "16px",
        color: "#cccccc",
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 34, "R: Restart from last checkpoint", {
        fontFamily: "monospace",
        fontSize: "16px",
        color: "#cccccc",
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 58, "M: Quit to main menu", {
        fontFamily: "monospace",
        fontSize: "16px",
        color: "#cccccc",
      })
      .setOrigin(0.5);

    const resume = () => {
      this.scene.stop();
      this.scene.resume("Game");
    };
    this.input.keyboard!.once("keydown-SPACE", resume);
    this.input.keyboard!.once("keydown-ESC", resume);

    this.input.keyboard!.once("keydown-R", () => {
      this.scene.stop();
      this.scene.start("Game");
    });

    this.input.keyboard!.once("keydown-M", () => {
      SaveState.reset();
      this.scene.stop();
      this.scene.stop("Game");
      this.scene.start("MainMenu");
    });
  }
}
