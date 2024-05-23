import { Color, Piece, PieceType } from './types';

export const pieceToString = (piece: Piece) => {
  switch (piece.piece) {
    case PieceType.PAWN:
      return 'Pawn';
    case PieceType.ROOK:
      return 'Rook';
    case PieceType.KNIGHT:
      return 'Knight';
    case PieceType.BISHOP:
      return 'Bishop';
    case PieceType.QUEEN:
      return 'Queen';
    case PieceType.KING:
      return 'King';
  }
};

export const colorToString = (color: Color) => {
  return color === Color.WHITE ? 'White' : 'Black';
};
