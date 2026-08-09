import Phaser from "phaser";
import { GAME_HEIGHT, PLAYER, TILE_SIZE } from "../config/constants";
import { LEVEL_DATA } from "../config/level";
import { Player } from "../entities/Player";
import { Enemy } from "../entities/Enemy";
import { InputHandler } from "../systems/InputHandler";

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private inputHandler!: InputHandler;
  private fpsText!: Phaser.GameObjects.Text;
  private groundLayer!: Phaser.Tilemaps.TilemapLayer;
  private enemies: Enemy[] = [];
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

    this.spawnEnemies();

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

    for (const enemy of this.enemies) {
      enemy.update(delta, this.player);
    }
    this.enemies = this.enemies.filter((enemy) => {
      if (enemy.isDefeated) {
        enemy.destroy();
        return false;
      }
      return true;
    });

    this.fpsText.setText(
      `FPS: ${Math.round(this.game.loop.actualFps)}  HP: ${this.player.health.current}/${this.player.health.max}  (P: toggle hitboxes)`,
    );
  }

  private spawnEnemies(): void {
    const spawnPoints = [
      { x: TILE_SIZE * 10, y: GAME_HEIGHT - TILE_SIZE * 3 },
      { x: TILE_SIZE * 26, y: GAME_HEIGHT - TILE_SIZE * 8 },
    ];

    for (const point of spawnPoints) {
      const enemy = new Enemy(this, point.x, point.y, this.groundLayer);
      this.physics.add.collider(enemy, this.groundLayer);
      this.physics.add.overlap(this.player, enemy, (_playerObj, enemyObj) =>
        this.handlePlayerEnemyOverlap(enemyObj as Enemy),
      );
      this.enemies.push(enemy);
    }
  }

  private handlePlayerEnemyOverlap(enemy: Enemy): void {
    if (enemy.isDefeated) {
      return;
    }

    const playerBottom = this.player.body.y + this.player.body.height;
    const enemyTop = enemy.body.y;
    const isStomp = this.player.body.velocity.y > 0 && playerBottom - enemyTop < 10;

    if (isStomp) {
      enemy.hit();
      this.player.body.setVelocityY(-PLAYER.stompBounceVelocity);
    } else {
      const knockDir = this.player.x < enemy.x ? -1 : 1;
      this.player.takeDamage(1, knockDir);
    }
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
