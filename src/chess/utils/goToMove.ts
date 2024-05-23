import { processMove } from '../logic/processMove';
import { GameState } from '../types';
import { INITIAL_GAME_STATE } from './initialGameState';

export const goToMove = (gameSate: GameState, moveIndex: number): GameState => {
  let state = INITIAL_GAME_STATE;

  for (let i = 0; i < moveIndex; i++) {
    [state] = processMove(state, gameSate.moveHistory[i]);
  }

  return state;
};
