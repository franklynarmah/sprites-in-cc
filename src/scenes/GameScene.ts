import Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH } from "../config/constants";
import { Player } from "../entities/Player";
import { InputHandler } from "../systems/InputHandler";

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private inputHandler!: InputHandler;
  private fpsText!: Phaser.GameObjects.Text;

  constructor() {
    super("Game");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#2b2f77");

    const ground = this.add.rectangle(
      GAME_WIDTH / 2,
      GAME_HEIGHT - 20,
      GAME_WIDTH,
      40,
      0x3a3f8f,
    );
    this.physics.add.existing(ground, true);

    const ledge = this.add.rectangle(
      GAME_WIDTH - 160,
      GAME_HEIGHT - 140,
      200,
      24,
      0x3a3f8f,
    );
    this.physics.add.existing(ledge, true);

    this.player = new Player(this, 120, GAME_HEIGHT - 100);
    this.physics.add.collider(this.player, ground);
    this.physics.add.collider(this.player, ledge);

    this.inputHandler = new InputHandler(this);

    this.fpsText = this.add
      .text(8, 8, "", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#ffffff",
      })
      .setScrollFactor(0);

    this.input.keyboard!.on("keydown-P", () => this.toggleDebug());
  }

  update(_time: number, delta: number): void {
    this.inputHandler.update();
    this.player.update(delta, this.inputHandler);
    this.fpsText.setText(`FPS: ${Math.round(this.game.loop.actualFps)}  (P: toggle hitboxes)`);
  }

  private toggleDebug(): void {
    const world = this.physics.world;
    if (world.drawDebug) {
      world.drawDebug = false;
      world.debugGraphic?.clear();
    } else {
      world.createDebugGraphic();
    }
  }
}
