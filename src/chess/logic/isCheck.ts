import { Color, GameState, PieceType } from '../types';
import { invertColor } from '../utils/colorUtils';
import { isSameSquare } from '../utils/squareUtils';
import { getTargetSquaresForPiece } from './getTargetSquares';

const getAllTargetSquares = (gameState: GameState, color: Color) => {
  return gameState.pieces
    .filter((p) => p.color === color)
    .flatMap((piece) => getTargetSquaresForPiece(gameState, piece));
};

export const isCheck = (gameState: GameState, color?: Color): boolean => {
  // is there a move possible for the other color that would take the king?
  const turnColor = color === undefined ? gameState.state.turn : color;

  // get the position of the king
  const king = gameState.pieces.find(
    (p) => p.piece === PieceType.KING && p.color === turnColor,
  );

  if (!king) {
    throw new Error(`No king found`);
  }

  const possibleTargetSquares = getAllTargetSquares(
    gameState,
    invertColor(turnColor),
  );

  return possibleTargetSquares.some((s) => isSameSquare(s, king.square));
};
