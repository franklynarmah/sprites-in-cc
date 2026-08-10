import playerIdle1 from "../assets/sprites/player/idle1.png";
import playerIdle2 from "../assets/sprites/player/idle2.png";
import playerIdle3 from "../assets/sprites/player/idle3.png";
import playerIdle4 from "../assets/sprites/player/idle4.png";
import playerIdle5 from "../assets/sprites/player/idle5.png";

// Maps a texture key -> the Vite-resolved URL to load it from. Add new
// entries here (and to the relevant ANIMATIONS block below) as more frames
// land instead of hardcoding paths in scenes.
export const PLAYER_SPRITE_SOURCES: Record<string, string> = {
  "player-idle-1": playerIdle1,
  "player-idle-2": playerIdle2,
  "player-idle-3": playerIdle3,
  "player-idle-4": playerIdle4,
  "player-idle-5": playerIdle5,
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
} as const;
