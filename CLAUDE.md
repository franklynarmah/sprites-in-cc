# 2D Platformer — Project Notes

## Tech Stack
- Phaser 3 (Arcade Physics) + TypeScript + Vite
- No frameworks beyond Phaser; keep it a normal web app until packaging (Electron/Tauri/Capacitor) happens later

## Folder Structure
```
/src
  /scenes       BootScene, PreloadScene, GameScene, ... one class per file
  /entities     Player, Enemy, Collectible — classes extending Phaser.GameObjects
  /systems      InputHandler, CameraController, SaveState, shared helpers
  /config       constants.ts — all tunable numbers live here, nowhere else
  /assets
    /sprites    /<entity-name>/<animation-name>_<frame>.png
    /tilesets
    /audio
main.ts         Game instance + scene list only, no gameplay logic
```

## Constants (src/config/constants.ts)
- Tile size: 32px
- Game canvas: 960x544 (17 tiles tall, pixel-aligned to the grid), Scale.FIT + CENTER_BOTH
- Gravity (rise): 1700, fall gravity multiplier: 1.6x on top of that while falling
- Move speed: 220, acceleration: 1800, drag: 1600
- Jump velocity: 620, fixed height regardless of button hold duration (no variable jump)
- Max jumps: 2 (double jump), budget resets on landing
- Coyote time: 100ms, jump buffer: 120ms
- These will keep changing as movement gets tuned — update this file whenever they do, don't let code and doc drift apart.

## Enemies & Health (src/entities/Enemy.ts, src/systems/Health.ts)
- Enemy state machine: idle (400ms on spawn) -> patrol -> hurt (220ms, on being stomped, then destroyed). Note: the field is named `aiState`, not `state` — `state` collides with a built-in property on Phaser.GameObjects.GameObject.
- Patrol AI turns around on hitting a wall (`body.blocked`) or reaching a platform edge (probes one tile ahead with `groundLayer.getTileAtWorldXY`) — never walks off a ledge.
- Player/enemy interaction is overlap-only (not a solid collider): landing on top with downward velocity stomps the enemy (defeats it, small bounce); side contact damages the player (`Player.takeDamage`) with knockback + 1s invulnerability (flashing alpha).
- `Health` is a plain composed class on `Player` (`player.health`), not a subclass — matches the composition-over-inheritance rule below. No death/respawn handling yet; that's step 7 (win/lose, checkpoints).
- Enemy constants: patrol speed 60, idle 400ms, hurt 220ms. Player constants: maxHp 3, invulnerability 1000ms, knockback (220, 260), stomp bounce velocity 400.

## Level Data (src/config/level.ts)
- Raw 2D array tilemap built via Phaser's `data` config path (`Parse2DArray`), NOT the Tiled-JSON loader — different index convention than Tiled files: **-1 = empty, 0 = solid** (0 indexes the tileset's first frame directly). If real Tiled-exported JSON is loaded later, switch to `tilemap.json` loading + `map.createLayer` from cache, where 0 means empty instead — don't mix the two conventions.
- Placeholder tileset is a single generated 32x32 texture (`tile-solid`) created at runtime in `PreloadScene`; swap for a real tileset image at step 9.
- Collision: `groundLayer.setCollision(0)`, one collider between player and the tile layer.

## Code Style
- One class per entity/scene file
- No `any`
- Prefer composition over inheritance for entity behaviors (e.g. a `Health` or `Patrol` component object over deep subclassing)
- All gameplay tuning constants belong in `config/constants.ts`, never hardcoded inline

## Build Order
Follow PLATFORMER_PLAN.md section 3 in order. Placeholder colored rectangles/blocks for steps 1-8; real Gemini-generated sprites only get swapped in at step 9. Keep the game playable after every step.

## Git
- Remote: https://github.com/franklynarmah/sprites-in-cc.git
- The user must remain the sole contributor on this repo — do not add a `Co-Authored-By` trailer to commits here.
- Commit after each numbered build-order step.

## Debug Tools (add early)
- On-screen FPS counter
- Hitbox/collision-box visualizer toggle
- Way to jump directly to any scene for testing
