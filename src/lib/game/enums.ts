export enum FieldState {
    Empty = 0,
    White = 1,
    Black = 2
}

export enum PlayerColor {
    White = 1,
    Black = 2
}

export enum GameStatus {
    NotStarted,
    InProgress,
    ChooseDeadStones,
    Ended
}

export enum Scoring {
    Area,
    Territory
}

export enum ResultType {
    ByScore = 'area',
    ByResign = 'area',
    ByTimeout = 'area',
    ByDisconnect = 'area',
}
