import { Square } from '../types';

export const isSameSquare = (a: Square, b: Square) => {
  return a[0] === b[0] && a[1] === b[1];
};

export const squareIndexToSquare = (index: number): Square => {
  return [Math.floor(index / 8), index % 8];
};

export const sqFromKey = (key: string): Square => {
  const [file, rank] = key.split('');
  return [parseInt(rank) - 1, file.charCodeAt(0) - 97];
};
export const keyFromSq = (sq: Square): string => {
  return String.fromCharCode(sq[1] + 97) + (sq[0] + 1);
};

export const translateSquare = (
  square: Square,
  rankOffset: number,
  fileOffset: number,
): Square => [square[0] + rankOffset, square[1] + fileOffset];

export const isSquareOffBoard = (square: Square): boolean => {
  return square[0] < 0 || square[0] > 7 || square[1] < 0 || square[1] > 7;
};
