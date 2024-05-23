import { Color, Piece } from '../types';

export const piecesToBoardState = (pieces: Piece[]) => {
  const whiteBoardState: (number | undefined)[][] = Array.from(
    { length: 8 },
    () => Array(8).fill(undefined),
  );

  const blackBoardState: (number | undefined)[][] = Array.from(
    { length: 8 },
    () => Array(8).fill(undefined),
  );

  pieces.forEach((piece, index) => {
    const [rank, file] = piece.square;
    if (piece.color === Color.WHITE) {
      whiteBoardState[rank][file] = index;
    } else {
      blackBoardState[rank][file] = index;
    }
  });

  return [whiteBoardState, blackBoardState];
};
