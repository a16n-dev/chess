import { Stack, Typography } from '@mui/joy';

import { BotData } from '../../chess/bot';
import { colorToString } from '../../chess/textHelpers';
import { Color } from '../../chess/types';

interface GameControlsProps {
  game: ChessGameInfo;
  setGame: (game: ChessGameInfo) => void;
}

export interface ChessGameInfo {
  playingAs: Color;
  bot?: BotData;
}

const GameControls = ({ game }: GameControlsProps) => {
  return (
    <Stack>
      <Typography>{'Playing as'}</Typography>
      {colorToString(game.playingAs)}
    </Stack>
  );
};

export default GameControls;
