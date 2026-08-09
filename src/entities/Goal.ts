import Phaser from "phaser";

export class Goal extends Phaser.GameObjects.Rectangle {
  declare body: Phaser.Physics.Arcade.Body;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 20, 56, 0xffd54a);
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
  }
}
