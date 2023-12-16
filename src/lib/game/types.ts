import type { FieldState, PlayerColor, ResultType, Scoring } from './enums';

export type BoardState = FieldState[][]

export type Stone = {
    x: number,
    y: number,
}

export type Unit = Stone[];

export type GameResult = {
    type: ResultType.ByScore
    deadStones: Stone[];
    points: { black: number, white: number }
    winner: PlayerColor
} | {
    type: ResultType.ByResign
    winner: PlayerColor
} | {
    type: ResultType.ByTimeout
    winner: PlayerColor
} | {
    type: ResultType.ByDisconnect
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
