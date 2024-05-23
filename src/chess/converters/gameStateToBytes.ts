import {AdditionalGameState, Color, GameState, Square} from "../types.ts";

const toBinString = (bytes: Uint8Array) =>
  bytes.reduce((str, byte) => str + byte.toString(2).padStart(8, '0'), '');

export const gameStateToBytes = (gameState: GameState) => {

  // const byteState = new Uint8Array(32)

  // first construct the 2 byte metadata
  const metadata = gameStateMetadataToBytes(gameState.state)
  // convert moves to bytes and append to end
  // convert piece data to bytes and append to end

  // output as binary string
  console.log(toBinString(metadata))
}

const squareToBits = (square: Square) => {
  return square[0] * 8 + square[1]
}

const gameStateMetadataToBytes = (gameState: AdditionalGameState): Uint8Array => {
  // create the first byte
  let firstByte = 0b00000000
  firstByte |= gameState.turn === Color.WHITE ? 0b00000000 : 0b10000000
  firstByte |= gameState.enPassantSquare ? 0b01000000 : 0b00000000

  // create the second byte
  let secondByte = 0b00000000
  if(gameState.enPassantSquare){
    secondByte |= squareToBits(gameState.enPassantSquare) << 4
  }
  secondByte |= gameState.whiteCanQueensideCastle ? 0b00001000 : 0b00000000
  secondByte |= gameState.whiteCanKingsideCastle ? 0b00000100 : 0b00000000
  secondByte |= gameState.blackCanQueensideCastle ? 0b00000010 : 0b00000000
  secondByte |= gameState.blackCanKingsideCastle ? 0b00000001 : 0b00000000

  return new Uint8Array([firstByte, secondByte])
}