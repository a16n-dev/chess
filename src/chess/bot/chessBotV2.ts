import { getValidMoves } from '../logic/getValidMoves';
import { isCheck } from '../logic/isCheck';
import { isCheckmate } from '../logic/isCheckmate';
import { processMove } from '../logic/processMove';
import { GameState, Move, PieceType } from '../types';

const PieceValue = {
  [PieceType.PAWN]: 1,
  [PieceType.ROOK]: 5,
  [PieceType.KNIGHT]: 3,
  [PieceType.BISHOP]: 3,
  [PieceType.QUEEN]: 9,
  [PieceType.KING]: 0,
};

/**
 * This iteration prioritizes pieces that capture the highest value pieces.
 */
export const chessBotV2 = (gameState: GameState): Move => {
  const possibleMoves = getValidMoves(gameState);

  let currentBest: { move: Move; score: number } = {
    move: possibleMoves[0],
    score: 0,
  };

  for (const move of possibleMoves) {
    // check if it results in a capture
    const [newState, metadata] = processMove(gameState, move);

    // if a move delivers a checkmate, immediately return it
    if (isCheckmate(newState)) {
      return move;
    }

    if (metadata.capturedPiece) {
      let value = PieceValue[metadata.capturedPiece.piece];

      // does it deliver check? if so, add 10 to the score
      if (isCheck(newState)) {
        value += 10;
      }

      if (value > currentBest.score) {
        currentBest = { move, score: value };
      }
    }
  }

  return currentBest.move;
};
