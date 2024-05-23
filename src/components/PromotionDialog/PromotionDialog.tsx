import { Grid, IconButton, Modal, ModalDialog, Typography } from '@mui/joy';
import { AsyncDialogProps } from 'react-dialog-async';

import { Color, PieceType } from '../../chess/types';
import BlackBishopIcon from '../ChessPiece/icons/BlackBishopIcon';
import BlackKingIcon from '../ChessPiece/icons/BlackKingIcon';
import BlackKnightIcon from '../ChessPiece/icons/BlackKnightIcon';
import BlackPawnIcon from '../ChessPiece/icons/BlackPawnIcon';
import BlackQueenIcon from '../ChessPiece/icons/BlackQueenIcon';
import BlackRookIcon from '../ChessPiece/icons/BlackRookIcon';
import WhiteBishopIcon from '../ChessPiece/icons/WhiteBishopIcon';
import WhiteKingIcon from '../ChessPiece/icons/WhiteKingIcon';
import WhiteKnightIcon from '../ChessPiece/icons/WhiteKnightIcon';
import WhitePawnIcon from '../ChessPiece/icons/WhitePawnIcon';
import WhiteQueenIcon from '../ChessPiece/icons/WhiteQueenIcon';
import WhiteRookIcon from '../ChessPiece/icons/WhiteRookIcon';

interface PromotionDialogProps {
  color: Color;
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

const PromotionDialog = ({
  open,
  handleClose,
  data,
}: AsyncDialogProps<PromotionDialogProps, PieceType>) => {
  return (
    <Modal open={open}>
      <ModalDialog>
        <Typography>{'Promote Pawn'}</Typography>
        <Grid container spacing={1}>
          {[
            PieceType.QUEEN,
            PieceType.ROOK,
            PieceType.BISHOP,
            PieceType.KNIGHT,
          ].map((p) => (
            <Grid xs={6} key={p}>
              <IconButton onClick={() => handleClose(p)} sx={{ width: '100%' }}>
                {data.color === Color.WHITE ? whiteCodeMap[p] : blackCodeMap[p]}
              </IconButton>
            </Grid>
          ))}
        </Grid>
      </ModalDialog>
    </Modal>
  );
};

export default PromotionDialog;
