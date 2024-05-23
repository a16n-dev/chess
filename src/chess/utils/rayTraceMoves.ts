import { Color, GameState, Square } from '../types';
import { getPieceAtSquare } from './pieceUtils';
import { isSquareOffBoard, translateSquare } from './squareUtils';

/**
 * This function operates along a straight line starting at a given square, until it reaches the edge of the board or a piece.
 */
export const rayTraceMoves = (
  gameState: GameState,
  startingSquare: Square,
  directionMatrix: [number, number],
  allowingCaptureOfColor?: Color,
): Square[] => {
  const targets: Square[] = [];

  let nextSquare: Square | null = startingSquare;
  while (nextSquare !== null) {
    nextSquare = translateSquare(
      nextSquare,
      directionMatrix[0],
      directionMatrix[1],
    );

    if (isSquareOffBoard(nextSquare)) {
      nextSquare = null;
    } else {
      const pieceAtSquare = getPieceAtSquare(gameState, nextSquare);
      if (pieceAtSquare === undefined) {
        targets.push(nextSquare);
      } else {
        if (
          allowingCaptureOfColor !== undefined &&
          pieceAtSquare.color === allowingCaptureOfColor
        ) {
          targets.push(nextSquare);
        }

        nextSquare = null;
      }
    }
  }

  return targets;
};

export const rayTraceAllDiagonals = (
  gameState: GameState,
  startingSquare: Square,
  allowingCaptureOfColor?: Color,
): Square[] => {
  const upLeftMoves = rayTraceMoves(
    gameState,
    startingSquare,
    [-1, 1],
    allowingCaptureOfColor,
  );
  const upRightMoves = rayTraceMoves(
    gameState,
    startingSquare,
    [1, 1],
    allowingCaptureOfColor,
  );
  const downLeftMoves = rayTraceMoves(
    gameState,
    startingSquare,
    [-1, -1],
    allowingCaptureOfColor,
  );
  const downRightMoves = rayTraceMoves(
    gameState,
    startingSquare,
    [1, -1],
    allowingCaptureOfColor,
  );

  return [...upLeftMoves, ...upRightMoves, ...downLeftMoves, ...downRightMoves];
};

export const rayTraceAllOrthogonals = (
  gameState: GameState,
  startingSquare: Square,
  allowingCaptureOfColor?: Color,
): Square[] => {
  const upMoves = rayTraceMoves(
    gameState,
    startingSquare,
    [0, 1],
    allowingCaptureOfColor,
  );
  const downMoves = rayTraceMoves(
    gameState,
    startingSquare,
    [0, -1],
    allowingCaptureOfColor,
  );
  const leftMoves = rayTraceMoves(
    gameState,
    startingSquare,
    [-1, 0],
    allowingCaptureOfColor,
  );
  const rightMoves = rayTraceMoves(
    gameState,
    startingSquare,
    [1, 0],
    allowingCaptureOfColor,
  );

  return [...upMoves, ...downMoves, ...leftMoves, ...rightMoves];
};

/**
 * This is used to evaluate possible moves for a given set of offsets from a starting square.
 * This is used to find possible moves for knights, kings, and capturing pawns.
 * It doesn't check for pieces in the way, so it's not used for sliding pieces - use the raycast
 * functions to handle these pieces
 */
export const evaluateOffsets = (
  gameState: GameState,
  startingSquare: Square,
  offsets: [number, number][],
  allowingCaptureOfColor?: Color,
  mustCapture?: boolean,
): Square[] => {
  return offsets
    .map((d) => translateSquare(startingSquare, d[0], d[1]))
    .filter((target) => {
      if (isSquareOffBoard(target)) {
        return false;
      }

      const pieceAtSquare = getPieceAtSquare(gameState, target);

      if (pieceAtSquare === undefined) {
        return !mustCapture;
      }

      return (
        allowingCaptureOfColor !== undefined &&
        pieceAtSquare.color === allowingCaptureOfColor
      );
    });
};
