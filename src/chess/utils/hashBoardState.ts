import { Piece } from '../types';

export const hashBoardState = (pieces: Piece[]) => {
  const dataString = pieces.reduce(
    (acc, p) => `${acc}:${p.piece}${p.color}${p.square[0]}${p.square[1]}`,
    `b`,
  );

  return dataString;
};
