import { Card, Divider, Sheet, Stack, Typography } from '@mui/joy';
import { useEffect, useState } from 'react';
import { useDialog } from 'react-dialog-async';

import { bots } from '../../chess/bot';
import { isCheck } from '../../chess/logic/isCheck';
import { isCheckmate } from '../../chess/logic/isCheckmate';
import { processMove } from '../../chess/logic/processMove';
import { Color, PieceType, Square } from '../../chess/types';
import { goToMove } from '../../chess/utils/goToMove';
import { INITIAL_GAME_STATE } from '../../chess/utils/initialGameState';
import { getPieceAtSquare } from '../../chess/utils/pieceUtils';
import Chessboard from '../Chessboard/Chessboard';
import { ChessGameInfo } from '../GameControls/GameControls';
import MoveHistory from '../MoveHistory/MoveHistory';
import PromotionDialog from '../PromotionDialog/PromotionDialog';

interface ChessGameProps {}

const ChessGame = ({}: ChessGameProps) => {
  const [state, setState] = useState(INITIAL_GAME_STATE);
  const [moveIndexOverride, setMoveIndexOverride] = useState<number | null>(
    null,
  );
  const [game] = useState<ChessGameInfo>({
    playingAs: Color.WHITE,
    bot: bots[1],
  });

  const promotionDialog = useDialog(PromotionDialog);

  const handleMove = async (fromSquare: Square, toSquare: Square) => {
    if (
      getPieceAtSquare(state, fromSquare)?.piece === PieceType.PAWN &&
      (toSquare[0] === 0 || toSquare[0] === 7)
    ) {
      const promotion = await promotionDialog.show({
        color: state.state.turn,
      });

      if (!promotion) {
        return;
      }

      const [newState] = processMove(state, {
        fromSquare,
        toSquare,
        promotion,
      });
      setState(newState);
    } else {
      const [newState] = processMove(state, {
        fromSquare,
        toSquare,
        promotion: null,
      });
      setState(newState);
    }
  };

  useEffect(() => {
    const bot = game.bot;
    if (bot && game.playingAs !== state.state.turn) {
      setTimeout(() => {
        const botMove = bot.bot(state);
        const [newState] = processMove(state, botMove);
        setState(newState);
      }, 100);
    }
  }, [game, state]);

  const gameOver = isCheckmate(state);

  return (
    <Stack sx={{ width: '100%', height: '100dvh' }}>
      <Stack sx={{ p: 1 }}>
        <Typography>{'Chess Bot'}</Typography>
      </Stack>
      <Divider />
      <Stack direction={'row'} sx={{ flexGrow: 1 }}>
        <Stack sx={{ flexGrow: 1, alignItems: 'center', pt: 8 }}>
          {moveIndexOverride !== null ? (
            <Chessboard
              gameState={goToMove(state, moveIndexOverride)}
              handleMove={() => {}}
              viewAs={game.playingAs}
            />
          ) : (
            <Chessboard
              gameState={state}
              handleMove={handleMove}
              viewAs={game.playingAs}
            />
          )}
          {gameOver && (
            <Card>
              <Stack sx={{ p: 1 }}>
                <Typography>{'Checkmate!'}</Typography>
              </Stack>
            </Card>
          )}
        </Stack>
        <Divider orientation={'vertical'} />
        <Sheet variant={'soft'}>
          <Stack sx={{ width: 400 }}>
            <Divider />
            <Typography sx={{ p: 1 }}>
              {isCheck(state) ? 'Check!' : 'Not in check'}
            </Typography>
            <Typography sx={{ p: 1 }}>
              {isCheckmate(state) ? 'Checkmate!' : 'Not in checkmate'}
            </Typography>
            <Divider />
            <MoveHistory
              state={state}
              moveOverride={moveIndexOverride}
              goToMoveOverride={(v) =>
                setMoveIndexOverride(
                  typeof v === 'number' && v > state.moveHistory.length - 1
                    ? null
                    : v,
                )
              }
            />
          </Stack>
        </Sheet>
      </Stack>
      <Divider />
      <Sheet variant={'soft'}>
        <Stack sx={{ p: 1 }}></Stack>
      </Sheet>
    </Stack>
  );
};

export default ChessGame;
