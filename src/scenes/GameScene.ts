import Phaser from "phaser";
import { GAME_HEIGHT, PLAYER, TILE_SIZE, UI } from "../config/constants";
import { GROUND_ROW_TOP, LEVEL_DATA, PIT_DEATH_Y } from "../config/level";
import { Player } from "../entities/Player";
import { Enemy } from "../entities/Enemy";
import { Checkpoint } from "../entities/Checkpoint";
import { Goal } from "../entities/Goal";
import { InputHandler } from "../systems/InputHandler";
import { SaveState } from "../systems/SaveState";
import { HUD } from "../systems/HUD";

const GROUND_SURFACE_Y = GROUND_ROW_TOP * TILE_SIZE;
const INITIAL_SPAWN = { x: TILE_SIZE * 2, y: GAME_HEIGHT - TILE_SIZE * 3 };
const CHECKPOINT_COLS = [22, 50];
const GOAL_COL = 57;

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private inputHandler!: InputHandler;
  private hud!: HUD;
  private fpsText!: Phaser.GameObjects.Text;
  private groundLayer!: Phaser.Tilemaps.TilemapLayer;
  private enemies: Enemy[] = [];
  private checkpoints: Checkpoint[] = [];
  private gameEnding = false;
  private debugOn = false;
  private tileDebugGraphic?: Phaser.GameObjects.Graphics;

  constructor() {
    super("Game");
  }

  create(): void {
    // Phaser reuses this same Scene instance across restarts (scene.start
    // doesn't construct a new GameScene), so class field initializers only
    // ever run once — all per-run state must be reset here explicitly.
    this.gameEnding = false;
    this.enemies = [];
    this.checkpoints = [];
    this.debugOn = false;
    this.tileDebugGraphic = undefined;

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

    const spawn = SaveState.getCheckpoint() ?? INITIAL_SPAWN;
    this.player = new Player(this, spawn.x, spawn.y);
    this.physics.add.collider(this.player, this.groundLayer);

    this.spawnEnemies();
    this.spawnCheckpoints();
    this.spawnGoal();

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setRoundPixels(true);

    this.inputHandler = new InputHandler(this);

    this.hud = new HUD(this, UI.hudMargin, UI.hudMargin, this.player.health.max);
    this.hud.setHealth(this.player.health.current);

    this.fpsText = this.add
      .text(UI.hudMargin, UI.hudMargin + UI.heartSize + 6, "", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#ffffff",
      })
      .setScrollFactor(0);

    this.input.keyboard!.on("keydown-P", () => this.toggleDebug());
    this.input.keyboard!.on("keydown-ESC", () => this.pauseGame());
  }

  update(_time: number, delta: number): void {
    if (this.gameEnding) {
      return;
    }

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

    if (this.player.y > PIT_DEATH_Y) {
      this.respawnFromPit();
    }

    if (this.player.health.isDead) {
      this.endGame("lose");
      return;
    }

    this.hud.setHealth(this.player.health.current);
    this.fpsText.setText(
      `FPS: ${Math.round(this.game.loop.actualFps)}  (P: hitboxes, ESC: pause)`,
    );
  }

  private pauseGame(): void {
    if (this.scene.isPaused()) {
      return;
    }
    this.scene.pause();
    this.scene.launch("Pause");
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

  private spawnCheckpoints(): void {
    const activeCheckpoint = SaveState.getCheckpoint();

    for (const col of CHECKPOINT_COLS) {
      const x = col * TILE_SIZE;
      const checkpoint = new Checkpoint(this, x, GROUND_SURFACE_Y - 20);
      if (activeCheckpoint?.x === x) {
        checkpoint.activate();
      }
      this.physics.add.overlap(this.player, checkpoint, () => {
        if (!checkpoint.isActivated) {
          checkpoint.activate();
          SaveState.setCheckpoint(x, INITIAL_SPAWN.y);
        }
      });
      this.checkpoints.push(checkpoint);
    }
  }

  private spawnGoal(): void {
    const x = GOAL_COL * TILE_SIZE;
    const goal = new Goal(this, x, GROUND_SURFACE_Y - 28);
    this.physics.add.overlap(this.player, goal, () => this.endGame("win"));
  }

  private respawnFromPit(): void {
    const spawn = SaveState.getCheckpoint() ?? INITIAL_SPAWN;
    this.player.body.reset(spawn.x, spawn.y);
    this.player.health.grantInvulnerability(PLAYER.invulnerabilityMs);
  }

  private endGame(outcome: "win" | "lose"): void {
    if (this.gameEnding) {
      return;
    }
    this.gameEnding = true;
    this.scene.start("GameOver", { outcome });
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
