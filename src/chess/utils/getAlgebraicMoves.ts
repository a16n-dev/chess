import { isCheck } from '../logic/isCheck';
import { isCheckmate } from '../logic/isCheckmate';
import { processMove } from '../logic/processMove';
import { CastleMove, GameState, PieceType } from '../types';
import { INITIAL_GAME_STATE } from './initialGameState';
import { getPieceAtSquare } from './pieceUtils';
import { keyFromSq } from './squareUtils';

export interface AlgebraicMove {
  move: string;
  moveIndex: number;
}

const PIECE_LETTER = {
  [PieceType.KING]: 'K',
  [PieceType.QUEEN]: 'Q',
  [PieceType.ROOK]: 'R',
  [PieceType.BISHOP]: 'B',
  [PieceType.KNIGHT]: 'N',
  [PieceType.PAWN]: '',
};

export const getAlgebraicMoves = (game: GameState): AlgebraicMove[] => {
  let state = INITIAL_GAME_STATE;

  const text: string[] = game.moveHistory.map((move) => {
    // get the piece being moved
    const piece = getPieceAtSquare(state, move.fromSquare)!;

    const targetSquare = keyFromSq(move.toSquare);

    const [newState, metadata] = processMove(state, move);
    state = newState;

    const captureText = metadata.capturedPiece ? 'x' : '';

    const checkText = isCheck(state) ? '+' : '';

    const checkMateText = isCheckmate(state) ? '#' : '';

    if (metadata.castle !== null) {
      switch (metadata.castle) {
        case CastleMove.KINGSIDE:
          return 'O-O';
        case CastleMove.QUEENSIDE:
          return 'O-O-O';
      }
    }

    // if pawn - handle this situation differently
    if (piece.piece === PieceType.PAWN) {
      if (captureText) {
        return [keyFromSq(move.fromSquare)[0], captureText, targetSquare].join(
          '',
        );
      }
      return [captureText, targetSquare, checkMateText || checkText].join('');
    } else {
      return [
        PIECE_LETTER[piece.piece],
        captureText,
        targetSquare,
        checkMateText || checkText,
      ].join('');
    }
  });

  return text.map((move, i) => ({
    move,
    moveIndex: i,
  }));
};
