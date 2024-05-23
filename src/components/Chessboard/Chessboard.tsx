import { Box, Sheet } from '@mui/joy';
import { useMemo, useState } from 'react';

import { getValidTargetSquaresForPiece } from '../../chess/logic/getValidTargetSquares';
import { Color, GameState, Piece, Square } from '../../chess/types';
import { squareIndexToSquare } from '../../chess/utils/squareUtils';
import ChessPiece from '../ChessPiece/ChessPiece';
import ChessboardMoveSquare from './ChessboardMoveSquare';

interface ChessboardProps {
  gameState: GameState;
  viewAs?: Color;
  handleMove: (from: Square, to: Square) => void;
}

const Chessboard = ({
  gameState,
  handleMove,
  viewAs = Color.WHITE,
}: ChessboardProps) => {
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);

  const attemptMove = (square: Square) => {
    if (selectedPiece === null) {
      return;
    }

    handleMove(selectedPiece.square, square);
    setSelectedPiece(null);
  };

  const validMoves = useMemo(
    () =>
      selectedPiece
        ? getValidTargetSquaresForPiece(gameState, selectedPiece)
        : [],
    [gameState, selectedPiece],
  );

  return (
    <Box>
      <Sheet sx={{ display: 'grid', width: 500, height: 500 }}>
        {Array.from({ length: 64 }).map((_, i) => {
          const index = viewAs === Color.WHITE ? i : 63 - i;

          const square = squareIndexToSquare(index);

          const isBlack = index % 2 === Math.floor(index / 8) % 2;

          return (
            <Box
              sx={{
                gridRow: 8 - square[0],
                gridColumn: square[1] + 1,
                backgroundColor: isBlack ? '#A5815A' : '#E9D7AD',
              }}
              key={index}
            />
          );
        })}
        {gameState.pieces.map((p) => (
          <ChessPiece
            viewAs={viewAs}
            clickable={p.color === gameState.state.turn}
            onClick={() =>
              p.color === gameState.state.turn && setSelectedPiece(p)
            }
            piece={p}
            key={p.id}
          />
        ))}
        {validMoves.map((m, i) => (
          <ChessboardMoveSquare
            viewAs={viewAs}
            key={i}
            onClick={() => attemptMove(m)}
            position={m}
          />
        ))}
      </Sheet>
    </Box>
  );
};

export default Chessboard;
