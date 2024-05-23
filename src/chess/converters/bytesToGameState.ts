import {AdditionalGameState, Color, GameState, Square} from "./types.ts";

const ADDITIONAL_GAME_STATE_BIT_MASKS = {
  // 1st byte
  turn:                    0b10000000,
  pieceCount:              0b00111110,
  hasEnPassantSquare:      0b00000001,
  // 2nd byte
  enPassantSquare:         0b11110000,
  whiteCanQueensideCastle: 0b00001000,
  whiteCanKingsideCastle:  0b00000100,
  blackCanQueensideCastle: 0b00000010,
  blackCanKingsideCastle:  0b00000001,
}

const bytesToGame = (bytes: Uint8Array) => {
}

// Converts 2 bytes into `AdditionalGameState`
const bytesToGameState = (bytes: Uint8Array): AdditionalGameState => {

  const turn = bytes[0] & ADDITIONAL_GAME_STATE_BIT_MASKS.turn
  const hasEnPassantSquare = bytes[0] & ADDITIONAL_GAME_STATE_BIT_MASKS.hasEnPassantSquare
  const pieceCount = bytes[0] & ADDITIONAL_GAME_STATE_BIT_MASKS.pieceCount


  const enPassantSquare = bytes[1] & ADDITIONAL_GAME_STATE_BIT_MASKS.enPassantSquare
  const whiteCanQueensideCastle = bytes[1] & ADDITIONAL_GAME_STATE_BIT_MASKS.whiteCanQueensideCastle
  const whiteCanKingsideCastle = bytes[1] & ADDITIONAL_GAME_STATE_BIT_MASKS.whiteCanKingsideCastle
  const blackCanQueensideCastle = bytes[1] & ADDITIONAL_GAME_STATE_BIT_MASKS.blackCanQueensideCastle
  const blackCanKingsideCastle = bytes[1] & ADDITIONAL_GAME_STATE_BIT_MASKS.blackCanKingsideCastle

  return {
    blackCanKingsideCastle: bitsToBoolean(blackCanKingsideCastle),
    blackCanQueensideCastle: bitsToBoolean(blackCanQueensideCastle),
    whiteCanKingsideCastle: bitsToBoolean(whiteCanKingsideCastle),
    whiteCanQueensideCastle: bitsToBoolean(whiteCanQueensideCastle),
    enPassantSquare: hasEnPassantSquare ? bitsToEnPassantSquare(enPassantSquare) : null,
    turn: bitsToColor(turn),
  }
}

const bitsToBoolean = (bits: number) => {
  return bits === 1
}

const bitsToColor = (bits: number) => {
  return bits === 0 ? Color.WHITE : Color.BLACK
}

const bitsToEnPassantSquare = (bits: number): Square => {
  // the enpassant square is the square behind the pawn that can be captured - either rank 3 or 6 (index 2 and 5)
  // number from 0 to 15
  // values from 0-7 map to white side pawns being captured
  // values from 8-15 map to black side pawns
  // rank is determined by the leftmost bit
  const rank = bits & 0b1000 ? 2 : 5
  const file = bits & 0b0111
  return [rank, file]
}

const bitsToSquare = (bits: number): Square => {
  const rank = bits & 0b111
  const file = (bits >> 3) & 0b111

  return [rank, file]
}

