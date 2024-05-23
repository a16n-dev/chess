import { GameState, Move } from '../types';
import { chessBotV1 } from './chessBotV1';
import { chessBotV2 } from './chessBotV2';
import { chessBotV3 } from './chessBotV3';

export interface BotData {
  name: string;
  description: string;
  bot: (gameState: GameState) => Move;
}

export const bots: BotData[] = [
  {
    name: 'Random moves',
    description: 'This bot makes random moves',
    bot: chessBotV1,
  },
  {
    name: 'Agressive moves',
    description:
      'This bot always tries to capture pieces and put the opponent into check if possible',
    bot: chessBotV2,
  },
  {
    name: 'Smart moves',
    description: 'This bot tries to put itself in the best board position',
    bot: chessBotV3,
  },
];
