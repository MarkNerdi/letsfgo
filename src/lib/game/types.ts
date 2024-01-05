import type { PlayerColor, ResultType, Scoring } from './enums';

export type BoardState = (PlayerColor | undefined)[][]

export type Stone = {
    x: number,
    y: number,
}

export type Unit = Stone[];

export type GameResult = {
    type: ResultType.Score
    deadStones: Stone[];
    points: { black: number, white: number }
    winner: PlayerColor
} | {
    type: ResultType.Resign
    winner: PlayerColor
} | {
    type: ResultType.Timeout
    winner: PlayerColor
} | {
    type: ResultType.Disconnect
    winner: PlayerColor
}


export type GameSettings = {
    width: number
    height: number

    initialTime: number
    increment: number
    komi: number
    scoring: Scoring
}
