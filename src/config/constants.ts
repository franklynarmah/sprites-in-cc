export const TILE_SIZE = 32;

export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 540;

export const PHYSICS = {
  gravityY: 1700,
  moveSpeed: 220,
  acceleration: 1800,
  drag: 1600,
  jumpVelocity: 620,
  coyoteTimeMs: 100,
  jumpBufferMs: 120,
  // Fall faster than you rise, so a fixed-velocity jump doesn't feel
  // floaty by hanging symmetrically at the top of its arc.
  fallGravityMultiplier: 1.6,
};
