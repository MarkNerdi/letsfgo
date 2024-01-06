import type { Scoring } from '$lib/game/enums';
import type { ObjectId } from 'mongodb';

export type Lobby = {
    _id?: ObjectId | string;

    boardSizes:  DefaultBoardSize[];
    timeSettings: DefaultTimeSettings[];
    komi: number
    scoring: Scoring

    createdBy: ObjectId | string;
    createdAt: number;
};

export type DefaultBoardSize = 9 | 13 | 19
export type DefaultTimeSettings = '5+5' | '5+10' | '5+15' | '15+5' | '15+10' | '25+15' | '25+5' | '25+10' | '25+15'
