# Art Asset Spec (for Gemini image generation)

This is the shopping list for step 9 (real art swap). Everything in the game
right now is a placeholder colored rectangle — this doc describes exactly
what to generate to replace them, sized to match the actual hitboxes/behavior
already coded so nothing needs to be re-tuned when the art drops in.

## Before you start: lock this spec

Reuse this in every Gemini prompt so all the art matches:

- **Style**: clean, vibrant 2D platformer art, soft cel-shaded/painterly look,
  saturated but not neon, readable silhouettes at small size. (Placeholder —
  swap for whatever style descriptor you actually want, just keep it
  identical across every prompt.)
- **Palette anchor** (current placeholder colors, for continuity — feel free
  to evolve): player `#4ade80` (green), enemy `#e05252` (red), checkpoint
  `#d7d15a` inactive → `#5ae06b` active, goal `#ffd54a` (gold), collectible
  `#ffd700` (gold).
- **Grid unit**: 32×32px tiles. All sprite canvases below are multiples of 8px.
- **Transparent PNG background** on every sprite (alpha channel), except the
  full-bleed background layers in section 8.
- **File naming / folders** (per `CLAUDE.md`):
  `/src/assets/sprites/<entity-name>/<animation-name>_<frame>.png`
  Frames numbered from `1` (e.g. `run_1.png`, `run_2.png`).

---

## 1. Player — `/src/assets/sprites/player/`

Hitbox is 32×48px. Generate each frame on a **48×64 canvas** (extra room for
limb movement) with the character visually centered and roughly filling the
inner 32×48 area — keep the silhouette close to that box so the art doesn't
feel like it's floating outside its own collision.

| Animation | Frames | Loop | Notes |
|---|---|---|---|
| `idle` | 4 | yes | small breathing/blink cycle |
| `run` | 6 | yes | full stride cycle |
| `jump` | 2 | no | rising pose (legs tucked), used for both the 1st and 2nd jump |
| `fall` | 2 | yes | falling pose, plays while airborne past the jump apex |
| `hurt` | 1 | no | reaction pose held during the knockback + invulnerability flash |

## 2. Enemy — `/src/assets/sprites/enemy/`

Hitbox is 28×28px. Generate each frame on a **40×40 canvas**.

| Animation | Frames | Loop | Notes |
|---|---|---|---|
| `idle` | 2 | yes | brief pause on spawn before patrolling |
| `walk` | 4 | yes | used for both patrol (slow) and chase (fast) — same frames, different playback speed |
| `hurt` | 1 | no | squashed/defeated pose, held briefly before removal |

## 3. Checkpoint — `/src/assets/sprites/checkpoint/`

Hitbox is 12×40px (a thin flagpole). Generate on a **32×48 canvas** — the
flag can extend past the pole's hitbox.

| Sprite | Frames | Loop | Notes |
|---|---|---|---|
| `inactive` | 1–2 | yes (if 2) | flag down/gray, optional subtle sway |
| `active` | 2–3 | yes | flag raised, waving — this is the "lively" one, plays once a checkpoint is touched |

## 4. Goal — `/src/assets/sprites/goal/`

Hitbox is 20×56px. Generate on a **40×64 canvas**. A banner, portal, or
star-topped post — your call — but it should read as clearly "the end of the
level" at a glance.

| Sprite | Frames | Loop | Notes |
|---|---|---|---|
| `idle` | 4–6 | yes | gentle glow/sparkle/flutter loop |

## 5. Collectible — `/src/assets/sprites/collectible/`

Hitbox is 14×14px. Generate on a **24×24 canvas**. A coin or gem.

| Sprite | Frames | Loop | Notes |
|---|---|---|---|
| `idle` | 6–8 | yes | spin or glint cycle. Pickup itself is a code-driven scale+fade tween, not a sprite animation — no pickup frames needed |

## 6. Tileset — `/src/assets/tilesets/`

All 32×32px, no transparency needed (opaque tiles). These need to tile
seamlessly against their own neighbors (edges must align):

| Tile | Notes |
|---|---|
| `ground_top.png` | grass/dirt top edge — faces upward, this is what the player walks on |
| `ground_fill.png` | dirt/stone fill — used for rows below the top edge |
| `platform.png` | the floating platform blocks — can be a wood/mossy-stone look, distinct from ground |
| `wall.png` | the vertical wall obstacle — can reuse `platform.png` if you want fewer assets |

*(Dev note for me, not Gemini: the level currently renders every solid tile
with one repeated texture — wiring up separate top/fill/platform/wall indices
is a small `level.ts` change I'll do when these land, not something you need
to worry about.)*

## 7. HUD — `/src/assets/sprites/hud/`

Generate at **32×32** (displayed smaller in-engine, generating at 2x keeps it
crisp):

| Sprite | Notes |
|---|---|
| `heart_full.png` | HUD health icon, filled |
| `heart_empty.png` | HUD health icon, empty/depleted |
| `coin_icon.png` | small icon next to the score number — match the collectible's design |

## 8. Background / Parallax — `/src/assets/sprites/background/`

This is the "lively" part. Structured as separate layers so the game code
can scroll each at a different speed (parallax) — please make each layer
**seamlessly tileable left-to-right** (the left and right edges must line up)
so it can repeat infinitely regardless of level length, except the clouds
which are separate floating sprites (see below).

| Layer | Size | Notes |
|---|---|---|
| `sky.png` | 960×544 (tileable horizontally) | gradient sky backdrop — dawn/day/dusk, your call |
| `hills.png` | 960×544 (tileable horizontally) | distant mountain/hill silhouettes, far background |
| `treeline.png` | 960×544 (tileable horizontally) | closer bushes/trees silhouette, sits just behind the playfield |

**Clouds** — generate as **individual standalone sprites**, not baked into
the sky image, so the code can drift each one independently at its own
speed/height for a genuine moving-cloud effect:

| Sprite | Notes |
|---|---|
| `cloud_1.png` … `cloud_5.png` | 5 different cloud shapes/sizes, transparent background, roughly 80–200px wide each |

**Optional stretch** (nice-to-have, skip if you want to keep the first pass small):

| Sprite | Frames | Notes |
|---|---|---|
| `bird_1.png` / `bird_2.png` | 2-frame flap loop | tiny background bird, code would spawn it flying across occasionally for extra life |

---

## What happens after you generate these

Drop the files into the paths above (matching filenames exactly) and let me
know — I'll wire up the loaders, `anims.create()` definitions, the tileset
swap, and the parallax scroll code. The cloud/hill/treeline "animation" is
entirely code-driven scrolling of static images, so none of those need frame
sheets — just clean single PNGs.
