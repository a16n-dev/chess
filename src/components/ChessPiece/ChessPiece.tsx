import { Stack } from '@mui/joy';

import { Color, Piece, PieceType } from '../../chess/types';
import BlackBishopIcon from './icons/BlackBishopIcon';
import BlackKingIcon from './icons/BlackKingIcon';
import BlackKnightIcon from './icons/BlackKnightIcon';
import BlackPawnIcon from './icons/BlackPawnIcon';
import BlackQueenIcon from './icons/BlackQueenIcon';
import BlackRookIcon from './icons/BlackRookIcon';
import WhiteBishopIcon from './icons/WhiteBishopIcon';
import WhiteKingIcon from './icons/WhiteKingIcon';
import WhiteKnightIcon from './icons/WhiteKnightIcon';
import WhitePawnIcon from './icons/WhitePawnIcon';
import WhiteQueenIcon from './icons/WhiteQueenIcon';
import WhiteRookIcon from './icons/WhiteRookIcon';

interface ChessPieceProps {
  piece: Piece;
  clickable?: boolean;
  onClick?: () => void;
  viewAs: Color;
}

const whiteCodeMap = {
  [PieceType.PAWN]: <WhitePawnIcon sx={{ fontSize: '3rem' }} />,
  [PieceType.ROOK]: <WhiteRookIcon sx={{ fontSize: '3rem' }} />,
  [PieceType.KNIGHT]: <WhiteKnightIcon sx={{ fontSize: '3rem' }} />,
  [PieceType.BISHOP]: <WhiteBishopIcon sx={{ fontSize: '3rem' }} />,
  [PieceType.QUEEN]: <WhiteQueenIcon sx={{ fontSize: '3rem' }} />,
  [PieceType.KING]: <WhiteKingIcon sx={{ fontSize: '3rem' }} />,
};

const blackCodeMap = {
  [PieceType.PAWN]: <BlackPawnIcon sx={{ fontSize: '3rem' }} />,
  [PieceType.ROOK]: <BlackRookIcon sx={{ fontSize: '3rem' }} />,
  [PieceType.KNIGHT]: <BlackKnightIcon sx={{ fontSize: '3rem' }} />,
  [PieceType.BISHOP]: <BlackBishopIcon sx={{ fontSize: '3rem' }} />,
  [PieceType.QUEEN]: <BlackQueenIcon sx={{ fontSize: '3rem' }} />,
  [PieceType.KING]: <BlackKingIcon sx={{ fontSize: '3rem' }} />,
};

const ChessPiece = ({ piece, onClick, clickable, viewAs }: ChessPieceProps) => {
  return (
    <Stack
      onClick={clickable ? onClick : undefined}
      sx={{
        position: 'absolute',
        transition: 'all 0.2s',
        width: '12.5%',
        height: '12.5%',
        bottom:
          viewAs === Color.WHITE ? `${piece.square[0] * 12.5}%` : undefined,
        left: viewAs === Color.WHITE ? `${piece.square[1] * 12.5}%` : undefined,
        top: viewAs === Color.BLACK ? `${piece.square[0] * 12.5}%` : undefined,
        right:
          viewAs === Color.BLACK ? `${piece.square[1] * 12.5}%` : undefined,
        cursor: clickable ? 'pointer' : undefined,
        ['&:hover']: {
          backgroundColor: clickable ? 'rgba(0, 0, 0, 0.1)' : undefined,
        },
      }}
      alignItems={'center'}
      justifyContent={'center'}
    >
      {piece.color === Color.WHITE
        ? whiteCodeMap[piece.piece]
        : blackCodeMap[piece.piece]}
    </Stack>
  );
};

export default ChessPiece;
