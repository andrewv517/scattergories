export interface PlayerResponse {
  value: string,
  downVoters: PlayerData[],
}

export interface PlayerData {
  socketId: string,
  name: string,
  points: number,
  responses: PlayerResponse[],
  vote: PlayerData | undefined,
}

export interface Game {
  id: string,
  players: PlayerData[],
  host: PlayerData,
  responseIndex: number,
  readingCards: boolean,
  started: boolean,
  seconds: number,
  letter: string,
  options: string[],
  deny: Set<string>,
  choseLetter: boolean,
  playerReading: PlayerData,
  receivedResponses: boolean,
}

export const API_URL = 'https://scattergoriesapi.andrewvadeika.com'
// export const API_URL = 'http://localhost:8000';
export const COOKIE_NAME = 'scattergories-cookie';