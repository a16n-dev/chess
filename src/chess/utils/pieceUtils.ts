import { GameState, Piece, Square } from '../types';
import { isSameSquare } from './squareUtils';

export const getPieceAtSquare = (
  gameState: GameState,
  square: Square,
): Piece | undefined => {
  return gameState.pieces.find((piece) => isSameSquare(piece.square, square));
};

export const getPieceIndexAtSquare = (
  gameState: GameState,
  square: Square,
): number | undefined =>
  gameState.whitePieceIndexBoard[square[0]][square[1]] ??
  gameState.blackPieceIndexBoard[square[0]][square[1]];

export const getPiecesAtSquares = (
  gameState: GameState,
  squares: Square[],
): (Piece | undefined)[] => {
  return squares.map((square) => getPieceAtSquare(gameState, square));
};
