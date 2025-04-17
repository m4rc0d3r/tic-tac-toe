import { range } from "~/array";
import { isNullish } from "~/type-guards";

type Vec2 = {
  x: number;
  y: number;
};

const BOARD_SIZE = 3;
const BOARD_AREA = BOARD_SIZE ** 2;

const OFF_BOARD = null;
const OFF_BOARD_POSITION: Vec2 = { x: -1, y: -1 };
const X = "X";
const O = "O";
const EMPTY = " ";
const PLAYERS = [X, O] as const;
const CELL_CONTENT = [...PLAYERS, EMPTY] as const;

const LOSING_POSITION = -1;
const NEUTRAL_POSITION = 0;
const WINNING_POSITION = 1;
const WORST_MAXIMIZER_POSITION = -Infinity;
const WORST_MINIMIZER_POSITION = Infinity;

type X = typeof X;
type O = typeof O;
type Player = (typeof PLAYERS)[number];
type Board = CellContent[][];
type CellContent = (typeof CELL_CONTENT)[number];
type OffBoard = typeof OFF_BOARD;

type Move = {
  player: Player;
  position: Vec2;
};

function positionToIndex({ x, y }: Vec2) {
  return y * BOARD_SIZE + x;
}

function positionFromIndex(index: number): Vec2 {
  return {
    x: index % BOARD_SIZE,
    y: Math.trunc(index / BOARD_SIZE),
  };
}

function getCellContent(board: Board, { x, y }: Vec2) {
  return board[y]?.[x] ?? OFF_BOARD;
}

function fillCellWith(board: Board, { x, y }: Vec2, content: CellContent) {
  if (isNullish(board[y]?.[x])) {
    return false;
  }
  board[y][x] = content;
  return true;
}

function buildBoard(moves: Move[]) {
  const board = range(BOARD_SIZE).map(() => new Array<CellContent>(BOARD_SIZE).fill(EMPTY));
  for (const { player, position } of moves) {
    fillCellWith(board, position, player);
  }
  return board;
}

function isMoveAllowed(moves: Move[], position: Vec2, player: Player) {
  return (
    moves.length < BOARD_AREA &&
    !moves.some((move) => positionToIndex(move.position) === positionToIndex(position)) &&
    moves.at(-1)?.player !== player
  );
}

function getNumberOfCells(board: Board, content: CellContent): number;
function getNumberOfCells(moves: Move[], content: CellContent): number;
function getNumberOfCells(boardOrMoves: Board | Move[], content: CellContent) {
  if (Array.isArray(boardOrMoves[0])) {
    const flatBoard = (boardOrMoves as Board).flat();
    return flatBoard.filter((value) => value === content).length;
  }

  const moves = boardOrMoves as Move[];
  return content === EMPTY
    ? BOARD_AREA - moves.length
    : moves.filter(({ player }) => player === content);
}

function getOpponent(player: Player) {
  return player === X ? O : X;
}

function evaluate(board: Board, player: Player) {
  const indices = range(BOARD_SIZE);

  for (const cells of [
    indices.map((i) => getCellContent(board, { x: i, y: i })),
    indices.map((i) => getCellContent(board, { x: indices.length - 1 - i, y: i })),
    ...indices.map((i) => indices.map((j) => getCellContent(board, { x: i, y: j }))),
    ...indices.map((i) => indices.map((j) => getCellContent(board, { x: j, y: i }))),
  ]) {
    const [a, b, c] = cells;
    if (a && a !== EMPTY && a === b && b === c) {
      return a === player ? WINNING_POSITION : LOSING_POSITION;
    }
  }

  return NEUTRAL_POSITION;
}

function minimax(
  board: Board,
  player: Player,
  maximize: boolean,
  depth: number,
  alpha_: number,
  beta_: number,
) {
  const evaluation = evaluate(board, player);

  if (
    [WINNING_POSITION, LOSING_POSITION].includes(evaluation) ||
    getNumberOfCells(board, EMPTY) === 0
  ) {
    return {
      evaluation: evaluation / (depth + 1),
      position: OFF_BOARD_POSITION,
    };
  }

  type Result = {
    evaluation: number;
    position: Vec2;
  };
  const currentPlayer = maximize ? player : getOpponent(player);
  const isBetter = (a: Result, b: Result) =>
    maximize ? a.evaluation > b.evaluation : a.evaluation < b.evaluation;
  const best: Result = {
    evaluation: maximize ? WORST_MAXIMIZER_POSITION : WORST_MINIMIZER_POSITION,
    position: OFF_BOARD_POSITION,
  };

  let alpha = alpha_;
  let beta = beta_;
  const updateAlphaBeta = (candidate: Result) => {
    if (maximize) {
      alpha = Math.max(alpha, candidate.evaluation);
    } else {
      beta = Math.min(beta, candidate.evaluation);
    }
  };

  outer: for (const y of range(BOARD_SIZE)) {
    for (const x of range(BOARD_SIZE)) {
      const position = { x, y };
      if (getCellContent(board, position) === EMPTY) {
        try {
          fillCellWith(board, position, currentPlayer);
          const candidate = minimax(board, player, !maximize, depth + 1, alpha, beta);
          if (isBetter(candidate, best)) {
            best.evaluation = candidate.evaluation;
            best.position = position;
            updateAlphaBeta(candidate);
            if (beta <= alpha) break outer;
          }
        } finally {
          fillCellWith(board, position, EMPTY);
        }
      }
    }
  }

  return best;
}

function findBestMove(moves: Move[], player: Player) {
  return minimax(
    buildBoard(moves),
    player,
    true,
    0,
    WORST_MAXIMIZER_POSITION,
    WORST_MINIMIZER_POSITION,
  );
}

export {
  BOARD_AREA,
  BOARD_SIZE,
  buildBoard,
  CELL_CONTENT,
  EMPTY,
  evaluate,
  fillCellWith,
  findBestMove,
  getCellContent,
  getNumberOfCells,
  getOpponent,
  isMoveAllowed,
  LOSING_POSITION,
  minimax,
  NEUTRAL_POSITION,
  O,
  OFF_BOARD,
  PLAYERS,
  positionFromIndex,
  positionToIndex,
  WINNING_POSITION,
  WORST_MAXIMIZER_POSITION,
  WORST_MINIMIZER_POSITION,
  X,
};
export type { Board, CellContent, Move, OffBoard, Player, Vec2 };
