# 2D Platformer — Project Plan

## Overview
Building a 2D platformer using **Phaser 3 + TypeScript + Vite**. Pixel art/sprite assets are generated externally using Gemini's image generation and dropped into the asset pipeline. This document is the build plan — work through it in order, keeping the game playable at every step.

---

## 1. Tech Stack

- **Phaser 3** — game engine (rendering, physics via Arcade Physics, input, scenes)
- **TypeScript** — type safety, better tooling
- **Vite** — dev server + build tool (fast HMR, easy production builds)
- **Packaging (later)**: Electron or Tauri for desktop, Capacitor for mobile — the game itself stays a normal web app until then

---

## 2. Project Setup

1. Scaffold with Vite:
   ```
   npm create vite@latest . -- --template vanilla-ts
   ```
2. Install Phaser:
   ```
   npm install phaser
   ```
3. Remove Vite's default template cruft (`counter.ts`, default `style.css`, sample SVGs).
4. Confirm `npm run dev` boots a blank page before adding any game code.
5. Set up `index.html` with a `<div id="game"></div>` container and a `main.ts` entry point that creates the Phaser `Game` instance targeting it.

### Folder Structure
```
/src
  /scenes       BootScene, PreloadScene, MenuScene, GameScene, GameOverScene
  /entities     Player, Enemy, Collectible (classes extending Phaser.GameObjects)
  /systems      InputHandler, CameraController, SaveState, helpers
  /config       constants.ts (gravity, speeds, tile size, screen size)
  /assets
    /sprites
    /tilesets
    /audio
main.ts
index.html
vite.config.ts
tsconfig.json
CLAUDE.md
```

### CLAUDE.md (create at project root)
A short file describing for Claude Code, across sessions:
- Tech stack (Phaser 3, TS, Vite)
- Folder structure and conventions above
- Tile size and physics constants once decided (e.g. 32px tiles, gravity value, jump velocity)
- Code style preferences (e.g. one class per entity file, no `any`, prefer composition over inheritance for entity behaviors)
- Where assets live and the naming convention for sprite files (see Section 6)

---

## 3. Build Order (get each step playable before moving to the next)

1. **Empty scene + camera** — confirm the game boots, renders a background color, and the canvas resizes correctly.
2. **Player movement** — a colored rectangle (no art yet) with left/right movement, gravity, and jump. This is the most important step to get right early:
   - Acceleration / deceleration (not instant velocity snapping)
   - Jump arc tuning (gravity scale, jump velocity)
   - Coyote time (grace period after walking off a ledge)
   - Jump buffering (early jump press registers if landing is imminent)
3. **Tilemap + collision** — static ground/platforms/walls using placeholder colored blocks or a simple Tiled-exported tilemap JSON. Get solid collision working (no clipping, no sticking to walls).
4. **Camera follow + level bounds** — camera follows player smoothly, clamped to level edges.
5. **Enemies / hazards** — basic patrol AI (walk to edge, turn around), collision damage to player, simple state (idle/patrol/hurt).
6. **Collectibles / scoring** — coins/gems, score counter, pickup animation/sound hook (silent for now).
7. **Win/lose states, checkpoints, respawn** — level-complete trigger, death/respawn flow, checkpoint saving.
8. **UI** — HUD (health, score), pause menu, main menu, game-over screen.
9. **Swap in real art** — replace placeholder rectangles/blocks with Gemini-generated sprites (see Section 6).
10. **Audio** — SFX (jump, hit, pickup, death) and background music, with a mute toggle.
11. **Polish pass** — particle effects (dust on landing, hit sparks), screen shake, camera easing, juice.

**Important:** Do steps 1–8 with placeholder graphics (colored rectangles) before touching art. This decouples "does the game feel good" from "does the game look good," and your Gemini art slots in cleanly at step 9 instead of forcing rewrites.

---

## 4. Working with Claude Code Effectively

- Commit after each numbered step above — small, testable increments, run the game after every change.
- Keep `CLAUDE.md` up to date as constants get finalized (tile size, gravity, etc.) so Claude Code stays consistent across sessions instead of re-deriving values.
- Ask for **debug tools early**: an on-screen FPS counter, a hitbox/collision-box visualizer toggle, and a way to jump directly to any scene for testing. These pay for themselves fast when tuning platformer physics.
- Ask for **unit tests on pure logic** where feasible (scoring, state machines, save/load) even though visual gameplay testing stays manual.
- When movement/physics "feels off," describe the *feel* you want (e.g. "jump feels floaty," "landing feels too abrupt") rather than only reporting bugs — Claude Code can translate that into concrete constant changes (gravity, jump velocity, drag, hang time).

---

## 5. Input & Scale Manager (set up early, not retrofitted)

- Use Phaser's `Scale Manager` (`Phaser.Scale.FIT` or similar) from the start so the game handles different screen sizes/aspect ratios without later rework.
- Support keyboard input first; structure `InputHandler` so touch/virtual-button input can be added later without touching gameplay code (relevant if mobile export happens).

---

## 6. Asset Pipeline (Gemini-generated art)

1. **Lock a sprite spec before generating art**, and reuse it in every Gemini prompt for visual consistency:
   - Tile size (e.g. 32×32 or 16×16)
   - Character canvas size
   - Animation frame counts needed per character (idle, run, jump, fall, hurt)
   - Consistent color palette / art style description
2. Export PNGs with transparent backgrounds from Gemini.
3. Organize into `/src/assets/sprites/<entity-name>/<animation-name>_<frame>.png` (or pack into spritesheets once the layout is finalized).
4. Write a small **asset config file** (JSON or TS object) mapping sprite/animation names → file paths → frame dimensions, so Phaser's `load.spritesheet(...)` calls reference the config instead of hardcoded paths. This makes swapping/updating art a one-line change.
5. If Gemini output isn't pixel-aligned or padded consistently, write a small Node (sharp) or Python (Pillow) script to auto-trim/pad frames to a uniform grid before importing.

---

## 7. Packaging for Desktop & Mobile (after core game is solid)

### Desktop
- Wrap the Vite production build with **Electron** (larger, most common, easiest Phaser integration) or **Tauri** (much smaller binaries, uses native OS webview, minimal Rust needed for a basic wrapper).
- No game code changes required — point the shell at the built `index.html`.

### Mobile
- Use **Capacitor** to wrap the web build into a native iOS/Android shell (most common route for Phaser games).
- Before this step, make sure:
  - Touch controls (virtual D-pad/buttons or gestures) are implemented via `InputHandler`
  - Performance has been tested with realistic sprite/particle counts
  - Scale Manager is already handling multiple aspect ratios
- App store requirements (icons, splash screens, signing) are handled through Capacitor's native scaffolding, but submission itself is manual.

---

## 8. Suggested First Session in Claude Code

1. Paste this file in and ask Claude Code to scaffold the project per Section 2.
2. Get `npm run dev` running with a blank colored canvas.
3. Implement Section 3, Step 2 (player movement) with a placeholder rectangle — iterate on feel before anything else.
4. Create `CLAUDE.md` with the finalized constants from that tuning session.
5. Continue down the build order in Section 3.
