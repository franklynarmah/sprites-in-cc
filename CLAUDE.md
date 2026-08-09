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
- Game canvas: 960x540, Scale.FIT + CENTER_BOTH
- Gravity: 1200
- Move speed: 220, acceleration: 1800, drag: 1600
- Jump velocity: 520
- Coyote time: 100ms, jump buffer: 120ms
- These will keep changing as movement gets tuned — update this file whenever they do, don't let code and doc drift apart.

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
