import Phaser from "phaser";
import { ENEMY } from "../config/constants";

type EnemyState = "idle" | "patrol" | "hurt";

export class Enemy extends Phaser.GameObjects.Rectangle {
  declare body: Phaser.Physics.Arcade.Body;

  private readonly groundLayer: Phaser.Tilemaps.TilemapLayer;
  private aiState: EnemyState = "idle";
  private idleTimer = ENEMY.idleMs;
  private hurtTimer = 0;
  private direction: 1 | -1 = 1;

  constructor(scene: Phaser.Scene, x: number, y: number, groundLayer: Phaser.Tilemaps.TilemapLayer) {
    super(scene, x, y, ENEMY.width, ENEMY.height, 0xe05252);
    this.groundLayer = groundLayer;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setCollideWorldBounds(true);
  }

  get isDefeated(): boolean {
    return this.aiState === "hurt" && this.hurtTimer <= 0;
  }

  update(delta: number): void {
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

    this.body.setVelocityX(ENEMY.patrolSpeed * this.direction);

    const hitWall = this.direction > 0 ? this.body.blocked.right : this.body.blocked.left;
    const footAheadX = this.x + this.direction * (this.width / 2 + 2);
    const footY = this.y + this.height / 2 + 4;
    const tileAhead = this.groundLayer.getTileAtWorldXY(footAheadX, footY);

    if (hitWall || !tileAhead) {
      this.direction = this.direction > 0 ? -1 : 1;
    }
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
    this.setFillStyle(0x8f8f8f);
  }
}
