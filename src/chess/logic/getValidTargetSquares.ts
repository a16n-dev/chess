import { GameState, Piece, Square } from '../types';
import { getTargetSquaresForPiece } from './getTargetSquares';
import { isCheck } from './isCheck';
import { moveIsCastle, processMove } from './processMove';

export const getValidTargetSquaresForPiece = (
  gameState: GameState,
  piece: Piece,
): Square[] => {
  let targetSquares = getTargetSquaresForPiece(gameState, piece);

  // validation to only allow legal moves

  if (isCheck(gameState)) {
    targetSquares = targetSquares.filter((square) => {
      // don't allow castling to get out of check
      if (
        moveIsCastle(
          { fromSquare: piece.square, toSquare: square, promotion: null },
          piece,
        )
      ) {
        return false;
      }

      // filter out moves that don't resolve check
      const [newGameState] = processMove(gameState, {
        fromSquare: piece.square,
        toSquare: square,
        promotion: null,
      });

      return !isCheck(newGameState, piece.color);
    });
  }

  // filter out moves that would result in check
  targetSquares = targetSquares.filter((square) => {
    const [newGameState] = processMove(gameState, {
      fromSquare: piece.square,
      toSquare: square,
      promotion: null,
    });

    return !isCheck(newGameState, piece.color);
  });

  return targetSquares;
};
