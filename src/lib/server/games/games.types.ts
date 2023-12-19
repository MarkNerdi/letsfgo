import type { GameStatus } from '$lib/game/enums';
import type { GameResult, GameSettings } from '$lib/game/types';
import type { ObjectId } from 'mongodb';

export type Game = {
    _id?: ObjectId | string;

    blackPlayer: ObjectId | undefined;
    whitePlayer: ObjectId | undefined;
    status: GameStatus;

    settings: GameSettings;
    history: Move[];
    result: GameResult | undefined;
    
    createdBy: ObjectId | undefined;
    createdAt: number;
};

export type Move = {
    x: number;
    y: number;
    pass: boolean;
    time: number
}
