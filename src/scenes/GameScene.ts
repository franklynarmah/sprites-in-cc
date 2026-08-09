import Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH } from "../config/constants";

export class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#2b2f77");

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "Game boots OK", {
        fontFamily: "monospace",
        fontSize: "24px",
        color: "#ffffff",
      })
      .setOrigin(0.5);
  }
}
