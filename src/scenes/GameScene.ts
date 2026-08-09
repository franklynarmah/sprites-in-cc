import Phaser from "phaser";
import { GAME_HEIGHT, TILE_SIZE } from "../config/constants";
import { LEVEL_DATA } from "../config/level";
import { Player } from "../entities/Player";
import { InputHandler } from "../systems/InputHandler";

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private inputHandler!: InputHandler;
  private fpsText!: Phaser.GameObjects.Text;
  private groundLayer!: Phaser.Tilemaps.TilemapLayer;
  private debugOn = false;
  private tileDebugGraphic?: Phaser.GameObjects.Graphics;

  constructor() {
    super("Game");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#2b2f77");

    const map = this.make.tilemap({
      data: LEVEL_DATA,
      tileWidth: TILE_SIZE,
      tileHeight: TILE_SIZE,
    });
    const tileset = map.addTilesetImage(
      "tile-solid",
      "tile-solid",
      TILE_SIZE,
      TILE_SIZE,
    )!;
    this.groundLayer = map.createLayer(0, tileset, 0, 0)!;
    this.groundLayer.setCollision(0);

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.player = new Player(this, TILE_SIZE * 2, GAME_HEIGHT - TILE_SIZE * 3);
    this.physics.add.collider(this.player, this.groundLayer);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setRoundPixels(true);

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
    this.debugOn = !this.debugOn;
    const world = this.physics.world;

    if (this.debugOn) {
      world.createDebugGraphic();
      this.tileDebugGraphic = this.add.graphics();
      this.groundLayer.renderDebug(this.tileDebugGraphic, {
        tileColor: null,
        collidingTileColor: new Phaser.Display.Color(255, 61, 61, 120),
        faceColor: new Phaser.Display.Color(40, 255, 40, 200),
      });
    } else {
      world.drawDebug = false;
      world.debugGraphic?.clear();
      this.tileDebugGraphic?.destroy();
      this.tileDebugGraphic = undefined;
    }
  }
}
