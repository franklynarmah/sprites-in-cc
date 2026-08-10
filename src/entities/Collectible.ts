import Phaser from "phaser";

export class Collectible extends Phaser.GameObjects.Rectangle {
  declare body: Phaser.Physics.Arcade.Body;

  private collected = false;

  constructor(scene: Phaser.Scene, x: number, y: number, size: number, color: number) {
    super(scene, x, y, size, size, color);
    this.setAngle(45);
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
  }

  get isCollected(): boolean {
    return this.collected;
  }

  /** Marks the collectible collected and plays a placeholder pickup animation (sound hook comes at step 10). */
  collect(): void {
    if (this.collected) {
      return;
    }
    this.collected = true;
    this.scene.tweens.add({
      targets: this,
      scale: 1.6,
      alpha: 0,
      duration: 150,
      onComplete: () => this.destroy(),
    });
  }
}
