import Phaser from "phaser";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("Preload");
  }

  preload(): void {
    // Asset loading will go here once real sprites are added (see plan Section 6).
  }

  create(): void {
    this.scene.start("Game");
  }
}
