import { Color, GameState, Piece, PieceType } from '../types';
import { piecesToBoardState } from './piecesToBoardState';

const BANK_RANK_ORDERING = [
  PieceType.ROOK,
  PieceType.KNIGHT,
  PieceType.BISHOP,
  PieceType.QUEEN,
  PieceType.KING,
  PieceType.BISHOP,
  PieceType.KNIGHT,
  PieceType.ROOK,
];

const getInitialPieces = (color: Color): Piece[] => {
  const pieces: Piece[] = [];

  for (let i = 0; i < 8; i++) {
    const rank = color === Color.WHITE ? 1 : 6;
    pieces.push({
      id: `${color}-${PieceType.PAWN}-${i}`,
      color,
      piece: PieceType.PAWN,
      square: [rank, i],
      hasMoved: false,
    });
  }

  // back rank
  BANK_RANK_ORDERING.forEach((piece, i) => {
    const rank = color === Color.WHITE ? 0 : 7;
    pieces.push({
      id: `${color}-${piece}-${i}`,
      color,
      piece,
      square: [rank, i],
      hasMoved: false,
    });
  });

  return pieces;
};

const INITIAL_PIECES = [
  ...getInitialPieces(Color.WHITE),
  ...getInitialPieces(Color.BLACK),
];

const [INITIAL_WHITE_INDEXES, INITIAL_BLACK_INDEXES] =
  piecesToBoardState(INITIAL_PIECES);

export const INITIAL_GAME_STATE: GameState = {
  moveHistory: [],
  gameStateHashes: [],
  pieces: [...getInitialPieces(Color.WHITE), ...getInitialPieces(Color.BLACK)],
  whitePieceIndexBoard: INITIAL_WHITE_INDEXES,
  blackPieceIndexBoard: INITIAL_BLACK_INDEXES,
  state: {
    blackCanKingsideCastle: true,
    blackCanQueensideCastle: true,
    whiteCanKingsideCastle: true,
    whiteCanQueensideCastle: true,
    enPassantSquare: null,
    turn: Color.WHITE,
  },
};
