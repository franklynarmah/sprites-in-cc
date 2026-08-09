export const TILE_SIZE = 32;

export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 544; // 17 tiles at TILE_SIZE=32, keeps the level grid pixel-aligned

export const PHYSICS = {
  gravityY: 1700,
  moveSpeed: 220,
  acceleration: 1800,
  drag: 1600,
  jumpVelocity: 620,
  coyoteTimeMs: 100,
  jumpBufferMs: 120,
  maxJumps: 2,
  // Fall faster than you rise, so a fixed-velocity jump doesn't feel
  // floaty by hanging symmetrically at the top of its arc.
  fallGravityMultiplier: 1.6,
};

export const PLAYER = {
  maxHp: 3,
  invulnerabilityMs: 1000,
  knockbackX: 220,
  knockbackY: 260,
  stompBounceVelocity: 400,
};

export const ENEMY = {
  width: 28,
  height: 28,
  patrolSpeed: 60,
  idleMs: 400,
  hurtMs: 220,
  // Total width of the patrol leash, centered on the enemy's spawn point (in tiles).
  patrolRangeTiles: 4,
  // While the player is inside the patrol range (and roughly the same height),
  // the enemy chases instead of turning back at the leash boundary.
  chaseSpeed: 110,
  chaseVerticalToleranceTiles: 1.5,
};
