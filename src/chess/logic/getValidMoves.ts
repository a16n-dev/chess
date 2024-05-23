import { GameState, Move, Piece, PieceType } from '../types';
import { getValidTargetSquaresForPiece } from './getValidTargetSquares';

export const getValidMoves = (gameState: GameState): Move[] => {
  return gameState.pieces
    .filter((p) => p.color === gameState.state.turn)
    .flatMap((piece) => getValidMovesForPiece(gameState, piece));
};

export const getValidMovesForPiece = (
  gameState: GameState,
  piece: Piece,
): Move[] => {
  const targets = getValidTargetSquaresForPiece(gameState, piece);

  const moves: Move[] = [];

  // convert targets to moves
  if (piece.piece === PieceType.PAWN) {
    // check for promotion
    targets.forEach((t) => {
      if (t[0] === 0 || t[0] === 7) {
        moves.push(
          { fromSquare: piece.square, toSquare: t, promotion: PieceType.ROOK },
          {
            fromSquare: piece.square,
            toSquare: t,
            promotion: PieceType.BISHOP,
          },
          {
            fromSquare: piece.square,
            toSquare: t,
            promotion: PieceType.KNIGHT,
          },
          { fromSquare: piece.square, toSquare: t, promotion: PieceType.QUEEN },
        );
      } else {
        moves.push({ fromSquare: piece.square, toSquare: t, promotion: null });
      }
    });
  } else {
    moves.push(
      ...targets.map((t) => ({
        fromSquare: piece.square,
        toSquare: t,
        promotion: null,
      })),
    );
  }

  return moves;
};
