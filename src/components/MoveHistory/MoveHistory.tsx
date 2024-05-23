import { Box, Button, Divider, Grid, Sheet, Stack, Typography } from '@mui/joy';
import { Fragment } from 'react';

import { GameState } from '../../chess/types';
import { getAlgebraicMoves } from '../../chess/utils/getAlgebraicMoves';

interface MoveHistoryProps {
  state: GameState;
  goToMoveOverride: (moveIndex: number | null) => void;
  moveOverride: number | null;
}

const MoveHistory = ({
  state,
  goToMoveOverride,
  moveOverride,
}: MoveHistoryProps) => {
  const moves = getAlgebraicMoves(state);

  return (
    <Box>
      <Typography sx={{ p: 2 }} level={'title-lg'} gutterBottom>
        {'Moves'}
      </Typography>
      <Box sx={{ height: 400, overflowY: 'scroll', overflowX: 'hidden' }}>
        <Grid container spacing={1}>
          {moves.map((move, index) => {
            const isWhiteMove = index % 2 === 0;

            return (
              <Fragment key={index}>
                {isWhiteMove && (
                  <Grid xs={2}>
                    <Typography sx={{ p: 0.5 }} level={'body-sm'}>
                      {Math.floor(index / 2) + 1}
                    </Typography>
                  </Grid>
                )}
                <Grid xs={5}>
                  <Sheet
                    onClick={() => goToMoveOverride(index + 1)}
                    invertedColors
                    variant={isWhiteMove ? 'solid' : 'outlined'}
                    sx={{
                      py: 0.5,
                      pl: 1,
                      pr: 2,
                      maxWidth: 'min-content',
                      borderRadius: 4,
                      cursor: 'pointer',
                    }}
                  >
                    <Typography
                      level={'title-sm'}
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      {move.move}
                    </Typography>
                  </Sheet>
                </Grid>
              </Fragment>
            );
          })}
        </Grid>
      </Box>
      <Divider />
      <Stack sx={{ p: 2 }} direction={'row'} spacing={1}>
        <Button
          disabled={moveOverride === 0 || state.moveHistory.length === 0}
          color={'neutral'}
          variant={'outlined'}
          onClick={() => goToMoveOverride(0)}
        >
          {'<<'}
        </Button>
        <Button
          disabled={moveOverride === 0 || state.moveHistory.length === 0}
          color={'neutral'}
          variant={'outlined'}
          onClick={() =>
            goToMoveOverride(
              moveOverride !== null
                ? moveOverride - 1
                : state.moveHistory.length - 1,
            )
          }
        >
          {'<'}
        </Button>
        <Button
          disabled={moveOverride === null}
          onClick={() =>
            goToMoveOverride(moveOverride !== null ? moveOverride + 1 : null)
          }
          color={'neutral'}
          variant={'outlined'}
        >
          {'>'}
        </Button>
        <Button
          onClick={() => goToMoveOverride(null)}
          disabled={moveOverride === null}
          color={'neutral'}
          variant={'outlined'}
        >
          {'>>'}
        </Button>
      </Stack>
      <Divider />
      {/* <Stack>*/}
      {/*  {state.gameStateHashes.map((h) => (*/}
      {/*    <Typography key={h}>{h}</Typography>*/}
      {/*  ))}*/}
      {/* </Stack>*/}
    </Box>
  );
};

export default MoveHistory;
