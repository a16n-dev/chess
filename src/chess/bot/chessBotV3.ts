import { getValidMoves } from '../logic/getValidMoves';
import { isCheck } from '../logic/isCheck';
import { isCheckmate } from '../logic/isCheckmate';
import { processMove } from '../logic/processMove';
import { Color, GameState, Move, PieceType } from '../types';
import { getPieceAtSquare } from '../utils/pieceUtils';

const PieceValue = {
  [PieceType.PAWN]: 1,
  [PieceType.ROOK]: 5,
  [PieceType.KNIGHT]: 3,
  [PieceType.BISHOP]: 3,
  [PieceType.QUEEN]: 9,
  [PieceType.KING]: 0,
};

// these are all for white - invert for black
const pieceSquareTable = {
  [PieceType.PAWN]: [
    [0.9, 1, 1, 1, 1, 1, 1, 0.9],
    [0.7, 0.8, 0.8, 0.9, 0.9, 0.8, 0.8, 0.7],
    [0.4, 0.6, 0.6, 0.7, 0.7, 0.6, 0.6, 0.4],
    [0.3, 0.4, 0.5, 0.6, 0.6, 0.5, 0.4, 0.3],
    [0.2, 0.3, 0.4, 0.5, 0.5, 0.4, 0.3, 0.2],
    [0.15, 0.1, 0.25, 0.3, 0.3, 0.25, 0.1, 0.15],
    [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  [PieceType.ROOK]: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0.1, 0.3, 0.4, 0.5, 0.5, 0.4, 0.3, 0.1],
    [0.1, 0.2, 0.3, 0.4, 0.4, 0.3, 0.2, 0.1],
  ],
  [PieceType.BISHOP]: [
    [0.6, 0.5, 0, 0, 0, 0, 0.5, 0.6],
    [0.5, 0.7, 0, 0, 0, 0, 0.7, 0.5],
    [0, 0, 0.8, 0.7, 0.7, 0.8, 0, 0],
    [0.3, 0, 0.8, 1, 1, 0.8, 0, 0.3],
    [0.3, 0, 0.8, 1, 1, 0.8, 0, 0.3],
    [0, 0, 0.8, 0.7, 0.7, 0.8, 0, 0],
    [0.5, 0.7, 0, 0, 0, 0, 0.7, 0.5],
    [0.6, 0.5, 0, 0, 0, 0, 0.5, 0.6],
  ],
  [PieceType.KING]: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 0.5, 0.2, 0.2, 0.5, 1, 1],
  ],
  [PieceType.QUEEN]: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  [PieceType.KNIGHT]: [
    [0.2, 0, 0, 0, 0, 0, 0, 0.2],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0.1, 0.3, 0.2, 0.2, 0.2, 0.2, 0.3, 0.1],
  ],
};

// 0, 0 => 7, 0
//

/**
 * This iteration does some more fancy stuff to evaluate the best move based on board position etc...
 * This is based off intuition without any research
 */
export const chessBotV3 = (gameState: GameState): Move => {
  const possibleMoves = getValidMoves(gameState);

  let currentBest: { move: Move; score: number } = {
    move: possibleMoves[0],
    score: 0,
  };

  for (const move of possibleMoves) {
    const score = evaluateMove(gameState, move);

    // if infinity, return immediately
    if (score === Infinity) {
      return move;
    }

    if (score > currentBest.score) {
      currentBest = { move, score };
    }
  }

  return currentBest.move;
};

// the following factors:
// if the move delivers checkmate,
// - each piece has preferred squares, so give a base score based on the square it would land on
// - if it's a capture, the value of the piece being captured
// - bonus if it puts the king in check
// - how many squares on the board
//
const evaluateMove = (gameState: GameState, move: Move): number => {
  const piece = getPieceAtSquare(gameState, move.fromSquare)!;

  let startingVal =
    pieceSquareTable[piece.piece][
      piece.color === Color.WHITE ? 7 - move.toSquare[0] : move.toSquare[0]
    ][piece.color === Color.WHITE ? move.toSquare[1] : 7 - move.toSquare[1]];

  const [newState, metadata] = processMove(gameState, move);

  if (isCheckmate(newState)) {
    return Infinity;
  }

  if (isCheck(newState)) {
    startingVal += 1;
  }

  if (metadata.capturedPiece) {
    startingVal += PieceValue[metadata.capturedPiece.piece] / 5;
  }

  return startingVal;
};
