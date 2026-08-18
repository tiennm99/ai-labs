/**
 * @typedef {import("../types").Board} Board
 * @typedef {import("../types").Point} Point
 * @typedef {import("../types").TileData} TileData
 */

/**
 * @param {Board} board
 * @param {number} row
 * @param {number} col
 * @returns {boolean}
 */
function isEmpty(board, row, col) {
  const rows = board.length;
  const cols = board[0].length;
  if (row < 0 || row >= rows || col < 0 || col >= cols) {
    return row >= -1 && row <= rows && col >= -1 && col <= cols;
  }
  return board[row][col] === null;
}

/** @type {[number, number][]} */
const DIRS = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];

/**
 * @param {Board} board
 * @param {number} row
 * @param {number} col
 * @param {number} dr
 * @param {number} dc
 * @returns {Point[]}
 */
function raycast(board, row, col, dr, dc) {
  /** @type {Point[]} */
  const points = [];
  let r = row + dr;
  let c = col + dc;
  const rows = board.length;
  const cols = board[0].length;
  while (r >= -1 && r <= rows && c >= -1 && c <= cols && isEmpty(board, r, c)) {
    points.push({ row: r, col: c });
    r += dr;
    c += dc;
  }
  return points;
}

/**
 * @param {Board} board
 * @param {Point} a
 * @param {Point} b
 * @returns {boolean}
 */
function canConnectStraight(board, a, b) {
  if (a.row === b.row) {
    const minC = Math.min(a.col, b.col);
    const maxC = Math.max(a.col, b.col);
    for (let c = minC + 1; c < maxC; c++) {
      if (!isEmpty(board, a.row, c)) return false;
    }
    return true;
  }
  if (a.col === b.col) {
    const minR = Math.min(a.row, b.row);
    const maxR = Math.max(a.row, b.row);
    for (let r = minR + 1; r < maxR; r++) {
      if (!isEmpty(board, r, a.col)) return false;
    }
    return true;
  }
  return false;
}

/**
 * @param {Board} board
 * @param {Point} a
 * @param {Point} b
 * @returns {Point[] | null}
 */
export function findPath(board, a, b) {
  const tileA = board[a.row]?.[a.col];
  const tileB = board[b.row]?.[b.col];
  if (!tileA || !tileB || tileA.emoji !== tileB.emoji) return null;
  if (a.row === b.row && a.col === b.col) return null;

  // 0 bends: direct straight line
  if (canConnectStraight(board, a, b)) {
    return [a, b];
  }

  // 1 bend: check two possible corners
  /** @type {Point} */
  const corner1 = { row: a.row, col: b.col };
  if (
    isEmpty(board, corner1.row, corner1.col) &&
    canConnectStraight(board, a, corner1) &&
    canConnectStraight(board, corner1, b)
  ) {
    return [a, corner1, b];
  }

  /** @type {Point} */
  const corner2 = { row: b.row, col: a.col };
  if (
    isEmpty(board, corner2.row, corner2.col) &&
    canConnectStraight(board, a, corner2) &&
    canConnectStraight(board, corner2, b)
  ) {
    return [a, corner2, b];
  }

  // 2 bends: try all lines from A, for each reachable cell, try 1-bend to B
  for (const [dr, dc] of DIRS) {
    const reachable = raycast(board, a.row, a.col, dr, dc);
    for (const mid of reachable) {
      /** @type {Point} */
      const cornerA = { row: mid.row, col: b.col };
      if (
        isEmpty(board, cornerA.row, cornerA.col) &&
        canConnectStraight(board, mid, cornerA) &&
        canConnectStraight(board, cornerA, b)
      ) {
        return [a, mid, cornerA, b];
      }

      /** @type {Point} */
      const cornerB = { row: b.row, col: mid.col };
      if (
        isEmpty(board, cornerB.row, cornerB.col) &&
        canConnectStraight(board, mid, cornerB) &&
        canConnectStraight(board, cornerB, b)
      ) {
        return [a, mid, cornerB, b];
      }

      if (canConnectStraight(board, mid, b)) {
        return [a, mid, b];
      }
    }
  }

  return null;
}

/**
 * @param {Board} board
 * @returns {boolean}
 */
export function hasAnyValidMove(board) {
  /** @type {{ pos: Point; emoji: string }[]} */
  const tiles = [];
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c] !== null) {
        tiles.push({
          pos: { row: r, col: c },
          emoji: /** @type {TileData} */ (board[r][c]).emoji,
        });
      }
    }
  }

  /** @type {Map<string, Point[]>} */
  const groups = new Map();
  for (const t of tiles) {
    if (!groups.has(t.emoji)) groups.set(t.emoji, []);
    /** @type {Point[]} */ (groups.get(t.emoji)).push(t.pos);
  }

  for (const [, positions] of groups) {
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        if (findPath(board, positions[i], positions[j]) !== null) {
          return true;
        }
      }
    }
  }

  return false;
}
