import { Color } from '../types';

export const invertColor = (color: Color): Color =>
  color === Color.WHITE ? Color.BLACK : Color.WHITE;
