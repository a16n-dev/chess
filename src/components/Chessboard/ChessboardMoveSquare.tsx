import { Box, Stack } from '@mui/joy';

import { Color, Square } from '../../chess/types';

interface ChessboardMoveSquareProps {
  position: Square;
  onClick: () => void;
  viewAs: Color;
}

const ChessboardMoveSquare = ({
  position,
  onClick,
  viewAs,
}: ChessboardMoveSquareProps) => {
  return (
    <Stack
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        position: 'absolute',
        width: '12.5%',
        height: '12.5%',
        bottom: viewAs === Color.WHITE ? `${position[0] * 12.5}%` : undefined,
        left: viewAs === Color.WHITE ? `${position[1] * 12.5}%` : undefined,
        top: viewAs === Color.BLACK ? `${position[0] * 12.5}%` : undefined,
        right: viewAs === Color.BLACK ? `${position[1] * 12.5}%` : undefined,
        p: 2,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          backgroundColor: '#4f4f4f',
          opacity: 0.6,
          inset: 16,
          borderRadius: 99,
        }}
      />
    </Stack>
  );
};

export default ChessboardMoveSquare;
