import Phaser from "phaser";

const INACTIVE_COLOR = 0xd7d15a;
const ACTIVE_COLOR = 0x5ae06b;

export class Checkpoint extends Phaser.GameObjects.Rectangle {
  declare body: Phaser.Physics.Arcade.Body;

  private activated = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 12, 40, INACTIVE_COLOR);
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
  }

  get isActivated(): boolean {
    return this.activated;
  }

  activate(): void {
    if (this.activated) {
      return;
    }
    this.activated = true;
    this.setFillStyle(ACTIVE_COLOR);
  }
}
