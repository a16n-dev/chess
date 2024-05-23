import { colorToString } from '../textHelpers';
import {
  CastleMove,
  Color,
  GameState,
  Move,
  Piece,
  PieceType,
  Square,
} from '../types';
import { hashBoardState } from '../utils/hashBoardState';
import { piecesToBoardState } from '../utils/piecesToBoardState';
import { getPieceIndexAtSquare } from '../utils/pieceUtils';
import { isSameSquare } from '../utils/squareUtils';

export const moveIsCastle = (m: Move, piece: Piece): CastleMove | null => {
  if (piece.piece !== PieceType.KING) {
    return null;
  }

  const [fromRank, fromFile] = m.fromSquare;
  const [toRank, toFile] = m.toSquare;
  if (fromFile === 4 && fromRank === toRank) {
    if (toFile === 6) {
      return CastleMove.KINGSIDE;
    }
    if (toFile === 2) {
      return CastleMove.QUEENSIDE;
    }
  }

  return null;
};

export interface MoveMetadata {
  capturedPiece?: Piece;
  castle: CastleMove | null;
  enpassant?: boolean;
}

export const processMove = (
  game: GameState,
  move: Move,
): [GameState, MoveMetadata] => {
  // ===== First we need to find the relevant piece and figure out what's happening =====
  // find the piece on this square, and move it to the new square
  const pieceIndex = game.pieces.findIndex((piece) =>
    isSameSquare(piece.square, move.fromSquare),
  );

  if (pieceIndex === -1) {
    throw new Error(`No piece found on square ${move.fromSquare}`);
  }
  const movingPiece = game.pieces[pieceIndex];

  if (movingPiece.color !== game.state.turn) {
    throw new Error(`It's not ${colorToString(movingPiece.color)}'s turn`);
  }

  // Check if there's a piece on the target square
  let capturedPiece = game.pieces.find((piece) =>
    isSameSquare(piece.square, move.toSquare),
  );

  // if the piece falls on the en passant square, and is a pawn, mark the pawn as captured
  if (
    game.state.enPassantSquare !== null &&
    movingPiece.piece === PieceType.PAWN &&
    isSameSquare(move.toSquare, game.state.enPassantSquare)
  ) {
    capturedPiece = game.pieces.find((piece) =>
      isSameSquare(piece.square, [
        move.toSquare[0] - (piece.color === Color.WHITE ? 1 : -1),
        move.toSquare[1],
      ]),
    );
  }

  const newPieces = [...game.pieces];
  const isCastle = moveIsCastle(move, movingPiece);

  let canKingsideCastle = isCastle === null;
  let canQueensideCastle = isCastle === null;

  // if the king-side rook moved off it's starting square, it can't castle
  if (
    !movingPiece.hasMoved &&
    movingPiece.piece === PieceType.ROOK &&
    movingPiece.square[1] === 7
  ) {
    canKingsideCastle = false;
  }

  // if the queen-side rook moved off it's starting square, it can't castle
  if (
    !movingPiece.hasMoved &&
    movingPiece.piece === PieceType.ROOK &&
    movingPiece.square[1] === 0
  ) {
    canQueensideCastle = false;
  }

  // if the king has moved, it can't castle
  if (movingPiece.piece === PieceType.KING) {
    canKingsideCastle = false;
    canQueensideCastle = false;
  }

  let enPassantSquare: Square | null = null;
  // if this is a pawn moving two spaces, mark the en passant square
  if (
    movingPiece.piece === PieceType.PAWN &&
    Math.abs(move.toSquare[0] - move.fromSquare[0]) === 2
  ) {
    enPassantSquare = [
      move.toSquare[0] - (movingPiece.color === Color.WHITE ? 1 : -1),
      move.toSquare[1],
    ];
  }

  // ===== Then we move the pieces by manipulating the game state =====
  // if it's a promotion, change the piece type
  if (move.promotion !== null) {
    newPieces[pieceIndex] = {
      ...movingPiece,
      square: move.toSquare,
      piece: move.promotion,
      hasMoved: true,
    };
  } else {
    // if this is the king, and it's moved 2 squares, it's a castle
    newPieces[pieceIndex] = {
      ...movingPiece,
      square: move.toSquare,
      hasMoved: true,
    };
  }

  if (isCastle === CastleMove.KINGSIDE) {
    console.log('Castling kingside');
    const rookIndex = getPieceIndexAtSquare(game, [move.toSquare[0], 7]);

    if (rookIndex === undefined) {
      throw new Error(`No rook found`);
    }

    newPieces[rookIndex] = {
      ...game.pieces[rookIndex],
      square: [move.toSquare[0], 5],
      hasMoved: true,
    };
  }

  if (isCastle === CastleMove.QUEENSIDE) {
    console.log('Castling queenside');
    // move the rook
    const rookIndex = getPieceIndexAtSquare(game, [move.toSquare[0], 0]);

    if (rookIndex === undefined) {
      throw new Error(`No rook found`);
    }

    newPieces[rookIndex] = {
      ...game.pieces[rookIndex],
      square: [move.toSquare[0], 3],
      hasMoved: true,
    };
  }

  // if captured piece, remove it from the array
  if (capturedPiece) {
    newPieces.splice(game.pieces.indexOf(capturedPiece), 1);
  }

  const newBoardIndexes = piecesToBoardState(newPieces);

  const newStateHash = hashBoardState(newPieces);

  return [
    {
      pieces: newPieces,
      gameStateHashes: [...game.gameStateHashes, newStateHash],
      moveHistory: [...game.moveHistory, move],
      whitePieceIndexBoard: newBoardIndexes[0],
      blackPieceIndexBoard: newBoardIndexes[1],
      state: {
        blackCanKingsideCastle:
          game.state.turn === Color.BLACK
            ? canKingsideCastle
            : game.state.blackCanKingsideCastle,
        blackCanQueensideCastle:
          game.state.turn === Color.BLACK
            ? canQueensideCastle
            : game.state.blackCanQueensideCastle,
        enPassantSquare,
        turn: game.state.turn === Color.WHITE ? Color.BLACK : Color.WHITE,
        whiteCanKingsideCastle:
          game.state.turn === Color.WHITE
            ? canKingsideCastle
            : game.state.whiteCanKingsideCastle,
        whiteCanQueensideCastle:
          game.state.turn === Color.WHITE
            ? canQueensideCastle
            : game.state.whiteCanQueensideCastle,
      },
    },
    {
      castle: isCastle,
      capturedPiece: capturedPiece,
    },
  ];
};
