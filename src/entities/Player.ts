import Phaser from "phaser";
import { PHYSICS } from "../config/constants";
import { InputHandler } from "../systems/InputHandler";

const MAX_FALL_SPEED = 1000;

export class Player extends Phaser.GameObjects.Rectangle {
  declare body: Phaser.Physics.Arcade.Body;

  private coyoteTimer = 0;
  private jumpBufferTimer = 0;
  private jumpsUsed = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 32, 48, 0x4ade80);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setCollideWorldBounds(true);
    this.body.setMaxVelocity(PHYSICS.moveSpeed, MAX_FALL_SPEED);
    this.body.setDragX(PHYSICS.drag);
  }

  update(delta: number, input: InputHandler): void {
    const grounded = this.body.blocked.down || this.body.touching.down;

    if (grounded) {
      this.jumpsUsed = 0;
    }

    this.coyoteTimer = grounded
      ? PHYSICS.coyoteTimeMs
      : Math.max(0, this.coyoteTimer - delta);

    this.jumpBufferTimer = input.jumpJustPressed
      ? PHYSICS.jumpBufferMs
      : Math.max(0, this.jumpBufferTimer - delta);

    if (input.left) {
      this.body.setAccelerationX(-PHYSICS.acceleration);
    } else if (input.right) {
      this.body.setAccelerationX(PHYSICS.acceleration);
    } else {
      this.body.setAccelerationX(0);
    }

    const canJump =
      this.jumpsUsed === 0 ? this.coyoteTimer > 0 : this.jumpsUsed < PHYSICS.maxJumps;

    if (this.jumpBufferTimer > 0 && canJump) {
      this.body.setVelocityY(-PHYSICS.jumpVelocity);
      this.jumpsUsed += 1;
      this.jumpBufferTimer = 0;
      this.coyoteTimer = 0;
    }

    this.body.setGravityY(
      this.body.velocity.y > 0
        ? PHYSICS.gravityY * (PHYSICS.fallGravityMultiplier - 1)
        : 0,
    );
  }
}
