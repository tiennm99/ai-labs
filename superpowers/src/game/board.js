import { DIFFICULTY_CONFIGS } from "./constants";
import { getEmojisForDifficulty } from "./emoji";
import { hasAnyValidMove } from "./pathfinder";

/**
 * @typedef {import("../types").Board} Board
 * @typedef {import("../types").Difficulty} Difficulty
 * @typedef {import("../types").TileData} TileData
 * @typedef {import("../types").Point} Point
 */

let nextTileId = 0;

/**
 * @param {Difficulty} difficulty
 * @returns {Board}
 */
export function createBoard(difficulty) {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const { rows, cols } = config;
  const emojis = getEmojisForDifficulty(difficulty);

  // Create pairs
  /** @type {TileData[]} */
  const tiles = [];
  nextTileId = 0;
  for (const emoji of emojis) {
    tiles.push({ emoji, id: nextTileId++ });
    tiles.push({ emoji, id: nextTileId++ });
  }

  // Fisher-Yates shuffle
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }

  // Place into grid
  /** @type {Board} */
  const board = [];
  let idx = 0;
  for (let r = 0; r < rows; r++) {
    /** @type {(TileData | null)[]} */
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push(tiles[idx++]);
    }
    board.push(row);
  }

  // Validate at least one valid move exists; reshuffle if not
  while (!hasAnyValidMove(board)) {
    const allTiles = board.flat().filter((t) => t !== null);
    for (let i = allTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allTiles[i], allTiles[j]] = [allTiles[j], allTiles[i]];
    }
    let idx2 = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        board[r][c] = allTiles[idx2++];
      }
    }
  }

  return board;
}

/**
 * @param {Board} board
 * @returns {{ tile: TileData; pos: Point }[]}
 */
export function getRemainingTiles(board) {
  /** @type {{ tile: TileData; pos: Point }[]} */
  const result = [];
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      const cell = board[r][c];
      if (cell !== null) {
        result.push({ tile: cell, pos: { row: r, col: c } });
      }
    }
  }
  return result;
}

/**
 * @param {Board} board
 * @returns {Board}
 */
export function shuffleBoard(board) {
  const rows = board.length;
  const cols = board[0].length;

  /** @type {TileData[]} */
  const tiles = [];
  /** @type {Point[]} */
  const occupiedPositions = [];
  /** @type {Point[]} */
  const emptyPositions = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] !== null) {
        tiles.push(/** @type {TileData} */ (board[r][c]));
        occupiedPositions.push({ row: r, col: c });
      } else {
        emptyPositions.push({ row: r, col: c });
      }
    }
  }

  // Fisher-Yates shuffle the tiles
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }

  // Create new board with nulls
  /** @type {Board} */
  const newBoard = [];
  for (let r = 0; r < rows; r++) {
    newBoard.push(new Array(cols).fill(null));
  }

  // Place shuffled tiles back into occupied positions
  for (let i = 0; i < tiles.length; i++) {
    const pos = occupiedPositions[i];
    newBoard[pos.row][pos.col] = tiles[i];
  }

  return newBoard;
}
