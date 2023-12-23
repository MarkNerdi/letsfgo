export enum PlayerColor {
    White = 0,
    Black = 1
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
    ByScore,
    ByResign,
    ByTimeout,
    ByDisconnect,
}

export enum Sound {
    Atari, // https://freesound.org/people/CamoMano/sounds/431019/
    PlaceStone, // https://freesound.org/people/el_boss/sounds/546119/
    KillUnit // https://freesound.org/people/NistuGgner/sounds/700535/
}
