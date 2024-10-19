export interface PlayerResponse {
  value: string,
  downVoters: string[],
  upVoters: string[],
  wroteSame: string[],
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
  seconds: number,
  letter: string,
  options: string[],
  deny: Set<string>,
  playerReadingIndex: number,
  started: boolean,
  choseLetter: boolean,
}

export const API_URL = process.env.NODE_ENV === 'development' ? 'http://192.168.1.132:7000' : 'https://scattergoriesapi.andrewvadeika.com'
export const COOKIE_NAME = 'scattergories-cookie';