import { GameState } from '../types';
import { getValidMoves } from './getValidMoves';

// is there 0 legal moves the player can make
export const isCheckmate = (gameState: GameState): boolean => {
  const allLegalMoves = getValidMoves(gameState);

  return allLegalMoves.length === 0;
};
