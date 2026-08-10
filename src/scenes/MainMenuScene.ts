import Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH } from "../config/constants";

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super("MainMenu");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#2b2f77");

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40, "2D PLATFORMER", {
        fontFamily: "monospace",
        fontSize: "32px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20, "Press SPACE to start", {
        fontFamily: "monospace",
        fontSize: "16px",
        color: "#cccccc",
      })
      .setOrigin(0.5);

    this.input.keyboard!.once("keydown-SPACE", () => this.scene.start("Game"));
  }
}
