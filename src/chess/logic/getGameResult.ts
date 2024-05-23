import { GameState } from '../types';
import { getValidMoves } from './getValidMoves';
import { isCheck } from './isCheck';

enum GameEvaluation {
  Check,
  Checkmate,
  Draw,
  InProgress,
}

export const getGameResult = (gameState: GameState) => {
  // check if its check

  const legalMoves = getValidMoves(gameState);

  if (isCheck(gameState)) {
    if (legalMoves.length === 0) {
      return GameEvaluation.Checkmate;
    }
    return GameEvaluation.Check;
  } else {
    if (legalMoves.length === 0) {
      return GameEvaluation.Draw;
    }
  }

  return GameEvaluation.InProgress;
};
