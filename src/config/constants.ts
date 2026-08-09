export const TILE_SIZE = 32;

export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 540;

export const PHYSICS = {
  gravityY: 1200,
  moveSpeed: 220,
  acceleration: 1800,
  drag: 1600,
  jumpVelocity: 520,
  coyoteTimeMs: 100,
  jumpBufferMs: 120,
  // Asymmetric gravity: fall faster than you rise, and cut the jump short
  // when the button is released early. Fixes the "floaty" feel that plain
  // symmetric gravity gives a fixed-velocity jump.
  fallGravityMultiplier: 1.6,
  lowJumpGravityMultiplier: 2.4,
};
