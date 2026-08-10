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
  // How long the hurt animation holds priority over jump/fall/run/idle after
  // a hit lands. Matches the hurt clip's own length (5 frames @ 12fps) so it
  // finishes its pose right as this expires, not shorter or longer.
  hurtAnimMs: 420,
  // Hitbox stays fixed regardless of sprite art; the idle/run/jump/fall/hurt
  // frames are drawn on a padded 48x64 canvas (see ASSET_SPEC.md) and
  // centered over this box so the physics body never has to change.
  hitboxWidth: 32,
  hitboxHeight: 48,
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

export const COLLECTIBLE = {
  size: 14,
  value: 10,
  color: 0xffd700,
};

export const UI = {
  hudMargin: 10,
  heartSize: 16,
  heartSpacing: 6,
  heartFilledColor: 0xe8453c,
  heartEmptyColor: 0x3a3a3a,
  overlayColor: 0x000000,
  overlayAlpha: 0.6,
};
