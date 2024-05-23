import { getValidMoves } from '../logic/getValidMoves';
import { GameState, Move } from '../types';

/**
 * This iteration just picks a random move
 */
export const chessBotV1 = (gameState: GameState): Move => {
  const possibleMoves = getValidMoves(gameState);

  const randomIndex = Math.floor(Math.random() * possibleMoves.length);

  return possibleMoves[randomIndex];
};
