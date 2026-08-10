# 2D Platformer — Project Notes

## Tech Stack
- Phaser 3 (Arcade Physics) + TypeScript + Vite
- No frameworks beyond Phaser; keep it a normal web app until packaging (Electron/Tauri/Capacitor) happens later

## Folder Structure
```
/src
  /scenes       BootScene, PreloadScene, MainMenuScene, GameScene, GameOverScene, PauseScene, ... one class per file
  /entities     Player, Enemy, Checkpoint, Goal, Collectible — classes extending Phaser.GameObjects (all now implemented)
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
- Enemy state machine: idle (400ms on spawn) -> patrol -> chase -> hurt (220ms, on being stomped, then destroyed). Note: the field is named `aiState`, not `state` — `state` collides with a built-in property on Phaser.GameObjects.GameObject.
- Patrol is a fixed leash centered on the enemy's spawn x (`patrolRangeTiles`, total width, default 4 tiles) — not edge-to-edge wandering. It still turns around early on hitting a wall or a real platform edge (probes one tile ahead with `groundLayer.getTileAtWorldXY`), so the leash can never walk it off a ledge.
- Chase: if the player is horizontally within the leash range AND within `chaseVerticalToleranceTiles` of the enemy's height, the enemy ignores the leash boundary and moves directly toward the player instead of turning back — this is what makes it "attack" rather than patrol away. Wall/ledge safety checks still apply during chase (it halts rather than reversing). Drops back to patrol once the player leaves the range.
- Player/enemy interaction is overlap-only (not a solid collider): landing on top with downward velocity stomps the enemy (defeats it, small bounce); side contact damages the player (`Player.takeDamage`) with knockback + 1s invulnerability (flashing alpha).
- `Health` is a plain composed class on `Player` (`player.health`), not a subclass — matches the composition-over-inheritance rule below.
- Enemy constants: patrol speed 60, chase speed 110, patrol range 4 tiles, idle 400ms, hurt 220ms. Player constants: maxHp 3, invulnerability 1000ms, knockback (220, 260), stomp bounce velocity 400.

## Win/Lose, Checkpoints, Respawn (src/scenes/GameOverScene.ts, src/systems/SaveState.ts, src/entities/Checkpoint.ts, src/entities/Goal.ts)
- **Pit fall** (`player.y > PIT_DEATH_Y` from `config/level.ts`): instant, silent respawn at the last checkpoint (or the initial spawn) — no scene transition, no HP cost, just a brief invulnerability grace period so a nearby enemy can't immediately re-kill on landing.
- **HP reaching 0** (from enemy combat only, not pit falls): transitions to `GameOverScene` with `{ outcome: 'lose' }` — a deliberate pause ("YOU DIED"), unlike the seamless pit respawn. Retry respawns at the last checkpoint with HP fully restored.
- **Touching the `Goal`** entity: transitions to `GameOverScene` with `{ outcome: 'win' }` ("LEVEL COMPLETE"). Retrying resets `SaveState` (clears the checkpoint) and returns to the very start — there's only one level so far.
- **Checkpoints**: overlap-only static markers, change color (yellow -> green) once touched, and write their respawn position into `SaveState` (a simple in-memory singleton, not persisted to localStorage yet). On scene (re)create, checkpoints matching the current `SaveState` checkpoint re-activate visually so state stays truthful after a restart.
- **Important Phaser gotcha**: `scene.start(...)` reuses the same `GameScene` instance — it does NOT construct a new one — so class field initializers (`private enemies: Enemy[] = []`, etc.) only run once, ever. `create()` must explicitly reset all per-run mutable state (`enemies`, `checkpoints`, `gameEnding`, debug graphics) at the top, every time, or stale objects from the previous run (referencing destroyed tilemap layers) keep getting `update()`'d and throw. This bit us once already — don't reintroduce a new mutable field without resetting it in `create()`.

## UI: HUD & Pause (src/systems/HUD.ts, src/scenes/PauseScene.ts)
- `HUD` is a plain composed class (like `Health`) owned by `GameScene`, not a scene of its own — it draws one placeholder heart Rectangle per max-HP point (`UI.heartFilledColor`/`heartEmptyColor`), scroll-factor 0. `setHealth(current)` just recolors existing hearts; real heart-icon sprites swap in at step 9 without touching the calling code.
- The debug FPS text is now separate from the real HUD (it used to double as the HP readout) — it sits just below the hearts and stays a debug/dev aid, not player-facing UI.
- Pause is a **separate scene** (`PauseScene`, key `"Pause"`), the standard Phaser pattern for overlays: `ESC` in `GameScene` calls `this.scene.pause()` (freezes update/physics for Game, but it keeps rendering behind the overlay) + `this.scene.launch("Pause")`. `PauseScene` draws a dim overlay + options and itself calls `this.scene.resume("Game")` / `this.scene.stop()` to unpause, `this.scene.start("Game")` to restart from the last checkpoint (reuses the exact same checkpoint-or-initial-spawn logic as a normal death retry), or `SaveState.reset()` + `this.scene.stop("Game")` + `this.scene.start("MainMenu")` to quit to the main menu.
- `MainMenuScene` (key `"MainMenu"`) is the boot target now — `PreloadScene.create()` starts `"MainMenu"`, not `"Game"` directly. Bare-bones: title text + "Press SPACE to start" → `this.scene.start("Game")`.
- Guard against double-pausing with `this.scene.isPaused()` (a live Phaser check), not a manually-tracked boolean field — avoids the class-field-reset trap described below since it's never stale across restarts.
- `UI` constants (`config/constants.ts`): hud margin, heart size/spacing/colors, pause overlay color/alpha.

## Collectibles & Scoring (src/entities/Collectible.ts)
- `Collectible` is an overlap-only static Rectangle placeholder (a 45°-rotated square, `COLLECTIBLE.color`/`size`), same construction pattern as `Checkpoint`/`Goal`. `collect()` is idempotent (guarded by an internal `collected` flag) and plays a placeholder pickup tween (scale up + fade, 150ms) before destroying itself — the sound hook comes at step 10, not implemented yet.
- `GameScene` spawns a fixed list of `COLLECTIBLE_SPAWNS` (one per floating platform, one over the pit gap, one near the goal) and tracks `score` as a plain field, reset to 0 in `create()` like every other per-run field (see the Phaser scene-reuse gotcha above — this one bit us with `enemies`/`checkpoints` already, so new mutable fields always go in that reset block). `handleCollectiblePickup` double-checks `isCollected` before adding `COLLECTIBLE.value` to score, so an overlap firing again during the pickup tween can't double-count.
- Score is per-attempt, not persisted in `SaveState` — a full scene restart (death retry, pause-restart, win-retry) resets it to 0 along with respawning every collectible. Only a pit-fall respawn (no scene restart) leaves already-collected items gone, consistent with how enemies behave.
- HUD shows score via `HUD.setScore(score)`, next to the hearts.

## Level Data (src/config/level.ts)
- Raw 2D array tilemap built via Phaser's `data` config path (`Parse2DArray`), NOT the Tiled-JSON loader — different index convention than Tiled files: **-1 = empty, 0 = solid** (0 indexes the tileset's first frame directly). If real Tiled-exported JSON is loaded later, switch to `tilemap.json` loading + `map.createLayer` from cache, where 0 means empty instead — don't mix the two conventions.
- Placeholder tileset is a single generated 32x32 texture (`tile-solid`) created at runtime in `PreloadScene`; swap for a real tileset image at step 9.
- Collision: `groundLayer.setCollision(0)`, one collider between player and the tile layer.
- `GROUND_ROW_TOP` and `PIT_DEATH_Y` are exported for use by respawn/death logic elsewhere — don't recompute the ground row inline.

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
