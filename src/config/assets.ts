import playerIdle1 from "../assets/sprites/player/idle1.png";
import playerIdle2 from "../assets/sprites/player/idle2.png";
import playerIdle3 from "../assets/sprites/player/idle3.png";
import playerIdle4 from "../assets/sprites/player/idle4.png";
import playerIdle5 from "../assets/sprites/player/idle5.png";
import playerRun1 from "../assets/sprites/player/run_1.png";
import playerRun2 from "../assets/sprites/player/run_2.png";
import playerRun3 from "../assets/sprites/player/run_3.png";
import playerRun4 from "../assets/sprites/player/run_4.png";
import playerRun5 from "../assets/sprites/player/run_5.png";
import playerRun6 from "../assets/sprites/player/run_6.png";
import playerRun7 from "../assets/sprites/player/run_7.png";
import playerJump1 from "../assets/sprites/player/jump_1.png";
import playerJump2 from "../assets/sprites/player/jump_2.png";
import playerJump3 from "../assets/sprites/player/jump_3.png";
import playerJump4 from "../assets/sprites/player/jump_4.png";
import playerJump5 from "../assets/sprites/player/jump_5.png";
import playerJump6 from "../assets/sprites/player/jump_6.png";
import playerJump7 from "../assets/sprites/player/jump_7.png";
import playerJump8 from "../assets/sprites/player/jump_8.png";
import playerJump9 from "../assets/sprites/player/jump_9.png";
import playerJump10 from "../assets/sprites/player/jump_10.png";
import playerFall3 from "../assets/sprites/player/fall_3.png";
import playerFall4 from "../assets/sprites/player/fall_4.png";

// Maps a texture key -> the Vite-resolved URL to load it from. Add new
// entries here (and to the relevant ANIMATIONS block below) as more frames
// land instead of hardcoding paths in scenes.
export const PLAYER_SPRITE_SOURCES: Record<string, string> = {
  "player-idle-1": playerIdle1,
  "player-idle-2": playerIdle2,
  "player-idle-3": playerIdle3,
  "player-idle-4": playerIdle4,
  "player-idle-5": playerIdle5,
  "player-run-1": playerRun1,
  "player-run-2": playerRun2,
  "player-run-3": playerRun3,
  "player-run-4": playerRun4,
  "player-run-5": playerRun5,
  "player-run-6": playerRun6,
  "player-run-7": playerRun7,
  "player-jump-1": playerJump1,
  "player-jump-2": playerJump2,
  "player-jump-3": playerJump3,
  "player-jump-4": playerJump4,
  "player-jump-5": playerJump5,
  "player-jump-6": playerJump6,
  "player-jump-7": playerJump7,
  "player-jump-8": playerJump8,
  "player-jump-9": playerJump9,
  "player-jump-10": playerJump10,
  "player-fall-1": playerFall3,
  "player-fall-2": playerFall4,
};

export const PLAYER_ANIMATIONS = {
  idle: {
    key: "player-idle",
    frameKeys: [
      "player-idle-1",
      "player-idle-2",
      "player-idle-3",
      "player-idle-4",
      "player-idle-5",
    ],
    frameRate: 6,
    repeat: -1,
  },
  run: {
    key: "player-run",
    frameKeys: [
      "player-run-1",
      "player-run-2",
      "player-run-3",
      "player-run-4",
      "player-run-5",
      "player-run-6",
      "player-run-7",
    ],
    frameRate: 12,
    repeat: -1,
  },
  jump: {
    key: "player-jump",
    // Plays on takeoff (restarts on every fresh jump, including the 2nd
    // jump) and keeps advancing while ascending. Once velocity.y turns
    // positive (falling), Player switches straight to `fall` — this rarely
    // reaches its own last frame, that's expected.
    frameKeys: [
      "player-jump-1",
      "player-jump-2",
      "player-jump-3",
      "player-jump-4",
      "player-jump-5",
      "player-jump-6",
      "player-jump-7",
      "player-jump-8",
      "player-jump-9",
      "player-jump-10",
    ],
    frameRate: 15,
    repeat: 0,
  },
  fall: {
    key: "player-fall",
    frameKeys: ["player-fall-1", "player-fall-2"],
    frameRate: 10,
    repeat: -1,
  },
} as const;
