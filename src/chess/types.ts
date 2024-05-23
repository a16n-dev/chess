export interface GameState {
  pieces: Piece[];
  state: AdditionalGameState;
  moveHistory: Move[];
  gameStateHashes: string[];
  // These are lookups for quickly finding a piece by the square it's on
  whitePieceIndexBoard: (number | undefined)[][];
  blackPieceIndexBoard: (number | undefined)[][];
}

export type Square = [rank: number, file: number];

export enum Color {
  WHITE = 0b0,
  BLACK = 0b1,
}

export enum PieceType {
  PAWN = 0b000,
  ROOK = 0b001,
  KNIGHT = 0b010,
  BISHOP = 0b011,
  QUEEN = 0b100,
  KING = 0b101,
}

export type Piece = {
  id: string;
  square: Square;
  piece: PieceType;
  color: Color;
  hasMoved: boolean;
};

export type AdditionalGameState = {
  turn: Color;
  whiteCanQueensideCastle: boolean;
  whiteCanKingsideCastle: boolean;
  blackCanQueensideCastle: boolean;
  blackCanKingsideCastle: boolean;
  enPassantSquare: Square | null;
};

export type Move = {
  fromSquare: Square;
  toSquare: Square;
  promotion: PieceType | null;
};

export enum CastleMove {
  QUEENSIDE = 0b0,
  KINGSIDE = 0b1,
}
