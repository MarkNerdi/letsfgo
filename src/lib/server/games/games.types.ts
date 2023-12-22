import type { GameStatus } from '$lib/game/enums';
import type { GameResult, GameSettings, Stone } from '$lib/game/types';
import type { ObjectId } from 'mongodb';

export type Game = {
    _id?: ObjectId | string;

    blackPlayer: ObjectId | undefined;
    whitePlayer: ObjectId | undefined;
    status: GameStatus;

    settings: GameSettings;
    history: Move[];

    deadstonesSelections: {
        black: Stone[];
        white: Stone[];
    }
    result: GameResult | undefined;
    
    createdBy: ObjectId | undefined;
    createdAt: number;
};

export type Move = {
    action: string;
    time: number
}
