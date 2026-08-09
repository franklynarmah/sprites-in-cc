export const LEVEL_COLS = 60;
export const LEVEL_ROWS = 17;

// Raw tilemap data convention (Phaser's Parse2DArray, not Tiled JSON): -1 is
// blank, 0+ indexes into the tileset starting at its first frame.
const EMPTY = -1;
const SOLID = 0;

function buildLevel(): number[][] {
  const rows: number[][] = Array.from({ length: LEVEL_ROWS }, () =>
    new Array(LEVEL_COLS).fill(EMPTY),
  );

  const groundRowTop = LEVEL_ROWS - 2;
  for (let row = groundRowTop; row < LEVEL_ROWS; row++) {
    rows[row].fill(SOLID);
  }

  // A pit wide enough to force a real jump across a gap.
  const pitStart = 18;
  const pitWidth = 3;
  for (let row = groundRowTop; row < LEVEL_ROWS; row++) {
    for (let col = pitStart; col < pitStart + pitWidth; col++) {
      rows[row][col] = EMPTY;
    }
  }

  // Floating platforms to test landing on ledges at different heights.
  const platforms = [
    { row: groundRowTop - 3, colStart: 6, colEnd: 10 },
    { row: groundRowTop - 5, colStart: 12, colEnd: 15 },
    { row: groundRowTop - 3, colStart: 24, colEnd: 28 },
    { row: groundRowTop - 6, colStart: 34, colEnd: 37 },
  ];
  for (const platform of platforms) {
    for (let col = platform.colStart; col <= platform.colEnd; col++) {
      rows[platform.row][col] = SOLID;
    }
  }

  // A tall wall to verify horizontal collision doesn't clip or stick.
  const wallCol = 45;
  for (let row = groundRowTop - 4; row < groundRowTop; row++) {
    rows[row][wallCol] = SOLID;
  }

  return rows;
}

export const LEVEL_DATA = buildLevel();
