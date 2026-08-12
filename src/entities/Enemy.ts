import Phaser from "phaser";
import { ENEMY, TILE_SIZE } from "../config/constants";
import { ENEMY_ANIMATIONS } from "../config/assets";
import { Player } from "./Player";

type EnemyAiState = "idle" | "patrol" | "chase" | "hurt";

export class Enemy extends Phaser.GameObjects.Sprite {
  declare body: Phaser.Physics.Arcade.Body;

  private readonly groundLayer: Phaser.Tilemaps.TilemapLayer;
  private readonly spawnX: number;
  private aiState: EnemyAiState = "idle";
  private idleTimer = ENEMY.idleMs;
  private hurtTimer = 0;
  private direction: 1 | -1 = 1;

  constructor(scene: Phaser.Scene, x: number, y: number, groundLayer: Phaser.Tilemaps.TilemapLayer) {
    super(scene, x, y, ENEMY_ANIMATIONS.idle.frameKeys[0]);
    this.groundLayer = groundLayer;
    this.spawnX = x;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setSize(ENEMY.width, ENEMY.height);
    this.body.setOffset(
      (this.width - ENEMY.width) / 2,
      (this.height - ENEMY.height) / 2,
    );
    this.body.setCollideWorldBounds(true);
    this.play(ENEMY_ANIMATIONS.idle.key);
  }

  get isDefeated(): boolean {
    return this.aiState === "hurt" && this.hurtTimer <= 0;
  }

  update(delta: number, player: Player): void {
    if (this.aiState === "idle") {
      this.idleTimer -= delta;
      if (this.idleTimer <= 0) {
        this.aiState = "patrol";
      }
      return;
    }

    if (this.aiState === "hurt") {
      this.hurtTimer -= delta;
      return;
    }

    const halfRange = (ENEMY.patrolRangeTiles / 2) * TILE_SIZE;
    const leftBound = this.spawnX - halfRange;
    const rightBound = this.spawnX + halfRange;

    const withinVerticalRange =
      Math.abs(player.y - this.y) < ENEMY.chaseVerticalToleranceTiles * TILE_SIZE;
    const withinPatrolRange = player.x >= leftBound && player.x <= rightBound;
    const playerDetected = withinVerticalRange && withinPatrolRange;

    this.aiState = playerDetected ? "chase" : "patrol";
    if (playerDetected) {
      this.direction = player.x >= this.x ? 1 : -1;
      this.updateFacingDirection();
    }

    const footAheadX = this.x + this.direction * (this.width / 2 + 2);
    const footY = this.y + this.height / 2 + 4;
    const tileAhead = this.groundLayer.getTileAtWorldXY(footAheadX, footY);
    const hitWall = this.direction > 0 ? this.body.blocked.right : this.body.blocked.left;
    const blockedAhead = hitWall || !tileAhead;

    if (this.aiState === "chase") {
      // Ignore the leash while chasing, but never walk off a real ledge or into a wall.
      this.body.setVelocityX(blockedAhead ? 0 : ENEMY.chaseSpeed * this.direction);
    } else {
      const reachedLeashBound =
        (this.direction > 0 && this.x >= rightBound) ||
        (this.direction < 0 && this.x <= leftBound);
      if (blockedAhead || reachedLeashBound) {
        this.direction = this.direction > 0 ? -1 : 1;
        this.updateFacingDirection();
        this.aiState = "idle";
        this.idleTimer = ENEMY.patrolPauseMs;
        this.body.setVelocityX(0);
        return;
      }
      this.body.setVelocityX(ENEMY.patrolSpeed * this.direction);
    }
  }

  private updateFacingDirection(): void {
    this.setFlipX(this.direction < 0);
  }

  /** Called when the player stomps this enemy from above. */
  hit(): void {
    if (this.aiState === "hurt") {
      return;
    }
    this.aiState = "hurt";
    this.hurtTimer = ENEMY.hurtMs;
    this.body.setVelocity(0, 0);
    this.body.enable = false;
    this.setTint(0x8f8f8f);
    this.anims.stop();
  }
}
