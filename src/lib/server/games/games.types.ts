import type { GameStatus } from '$lib/game/enums';
import type { GameResult, GameSettings, Stone } from '$lib/game/types';
import type { ObjectId } from 'mongodb';

export type Game = {
    _id?: ObjectId | string;

    blackPlayer: ObjectId | string | undefined;
    whitePlayer: ObjectId | string | undefined;
    status: GameStatus;

    settings: GameSettings;
    history: Move[];

    deadstonesSelections: {
        black: Stone[] | undefined;
        white: Stone[] | undefined;
    }
    result: GameResult | undefined;
    
    createdBy: ObjectId | string;
    createdAt: number;
};

export type Move = {
    action: string;
    time: number
}
