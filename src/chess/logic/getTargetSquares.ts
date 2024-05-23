import { Color, GameState, Piece, PieceType, Square } from '../types';
import { invertColor } from '../utils/colorUtils';
import { getPieceAtSquare, getPiecesAtSquares } from '../utils/pieceUtils';
import {
  evaluateOffsets,
  rayTraceAllDiagonals,
  rayTraceAllOrthogonals,
} from '../utils/rayTraceMoves';
import { isSquareOffBoard, translateSquare } from '../utils/squareUtils';

/**
 * For a given piece on the board, return all the squares it could move to.
 * Note that this doesn't check if the move is legal
 */
export const getTargetSquaresForPiece = (
  gameState: GameState,
  piece: Piece,
): Square[] => {
  switch (piece.piece) {
    case PieceType.PAWN:
      return getPawnMoves(gameState, piece);
    case PieceType.ROOK:
      return getRookMoves(gameState, piece);
    case PieceType.KNIGHT:
      return getKnightMoves(gameState, piece);
    case PieceType.BISHOP:
      return getBishopMoves(gameState, piece);
    case PieceType.QUEEN:
      return getQueenMoves(gameState, piece);
    case PieceType.KING:
      return getKingMoves(gameState, piece);
  }
};

const getPawnMoves = (gameState: GameState, piece: Piece): Square[] => {
  const targets: Square[] = [];

  // check if square in front is occupied
  const inFrontSquare = translateSquare(
    piece.square,
    piece.color === Color.BLACK ? -1 : 1,
    0,
  );

  const frontSquareFree =
    getPieceAtSquare(gameState, inFrontSquare) === undefined;

  if (frontSquareFree && !isSquareOffBoard(inFrontSquare)) {
    targets.push(inFrontSquare);
  }

  const secondInFrontSquare = translateSquare(
    piece.square,
    piece.color === Color.BLACK ? -2 : 2,
    0,
  );

  // if hasn't moved yet, it can move 2 squares forward
  if (
    !piece.hasMoved &&
    frontSquareFree &&
    getPieceAtSquare(gameState, secondInFrontSquare) === undefined &&
    !isSquareOffBoard(secondInFrontSquare)
  ) {
    targets.push(secondInFrontSquare);
  }

  // check if diagonals are occupied by enemy pieces

  // left diagonal
  const pawnOffsets: [number, number][] =
    piece.color === Color.BLACK
      ? [
          [-1, -1],
          [-1, 1],
        ]
      : [
          [1, -1],
          [1, 1],
        ];

  targets.push(
    ...evaluateOffsets(
      gameState,
      piece.square,
      pawnOffsets,
      invertColor(piece.color),
      true,
    ),
  );

  // en passant case
  // TODO

  return targets;
};

const getRookMoves = (gameState: GameState, piece: Piece): Square[] => {
  return rayTraceAllOrthogonals(
    gameState,
    piece.square,
    invertColor(piece.color),
  );
};

const getKnightMoves = (gameState: GameState, piece: Piece): Square[] => {
  const knightOffsets: [number, number][] = [
    [-1, 2],
    [1, 2],
    [-1, -2],
    [1, -2],
    [-2, 1],
    [2, 1],
    [-2, -1],
    [2, -1],
  ];

  return evaluateOffsets(
    gameState,
    piece.square,
    knightOffsets,
    invertColor(piece.color),
  );
};

const getBishopMoves = (gameState: GameState, piece: Piece): Square[] => {
  return rayTraceAllDiagonals(
    gameState,
    piece.square,
    invertColor(piece.color),
  );
};

const getQueenMoves = (gameState: GameState, piece: Piece): Square[] => {
  const orthoMoves = rayTraceAllOrthogonals(
    gameState,
    piece.square,
    invertColor(piece.color),
  );
  const diagMoves = rayTraceAllDiagonals(
    gameState,
    piece.square,
    invertColor(piece.color),
  );
  return [...orthoMoves, ...diagMoves];
};

const getKingMoves = (gameState: GameState, piece: Piece): Square[] => {
  const targets: Square[] = [];

  const kingOffsets: [number, number][] = [
    [-1, 1],
    [0, 1],
    [1, 1],
    [-1, 0],
    [1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
  ];

  targets.push(
    ...evaluateOffsets(
      gameState,
      piece.square,
      kingOffsets,
      invertColor(piece.color),
    ),
  );

  // check if can kingside castle
  if (!piece.hasMoved) {
    targets.push(...getCastlingTargets(gameState, piece));
  }
  // check game state to see if kingside castling is allowed
  // check empty squares

  return targets;
};

const getCastlingTargets = (gameState: GameState, piece: Piece): Square[] => {
  const targets: Square[] = [];

  const rank = piece.color === Color.WHITE ? 0 : 7;

  if (
    piece.color === Color.WHITE
      ? gameState.state.whiteCanKingsideCastle
      : gameState.state.blackCanKingsideCastle
  ) {
    const pieceInTheWay = getPiecesAtSquares(gameState, [
      [rank, 5],
      [rank, 6],
    ]).some((v) => v !== undefined);

    if (!pieceInTheWay) {
      targets.push([rank, 6]);
    }
  }
  if (
    piece.color === Color.WHITE
      ? gameState.state.whiteCanQueensideCastle
      : gameState.state.blackCanQueensideCastle
  ) {
    const pieceInTheWay = getPiecesAtSquares(gameState, [
      [rank, 1],
      [rank, 2],
      [rank, 3],
    ]).some((v) => v !== undefined);

    if (!pieceInTheWay) {
      targets.push([rank, 2]);
    }
  }

  return targets;
};
