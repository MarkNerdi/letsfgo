import { GameStatus } from '$lib/game/enums';
import type { GameSettings } from '$lib/game/types';
import { gameCollection } from '$lib/server/db';
import type { Game } from '$lib/server/games/games.types';
import { ObjectId, type UpdateResult } from 'mongodb';


async function create(id: string, settings: GameSettings, createdBy: string, otherPlayer: string): Promise<Game | null> {
    const [ blackPlayer, whitePlayer ] = [ new ObjectId(createdBy), new ObjectId(otherPlayer) ].sort(() => Math.random() - 0.5);

    const game: Game = {
        _id: new ObjectId(id),
        blackPlayer,
        whitePlayer,
        status: GameStatus.NotStarted,
        history: [],
        deadstonesSelections: {
            black: undefined,
            white: undefined,
        },
        result: undefined,
        settings,

        createdBy: new ObjectId(createdBy),
        createdAt: Date.now(),
    };

    await gameCollection.insertOne(game);
    return game;
}


async function getById(id: string): Promise<Game | null> {
    const game = await gameCollection.findOne({ _id: new ObjectId(id) });
    if (game) {
        game._id = String(game._id);
    }
    return game;
}

async function update(id: string, game: Partial<Game>): Promise<UpdateResult> {
    return gameCollection.updateOne({ _id: new ObjectId(id) }, { $set: { ...game } });
}

export const gameController = {
    create,
    update,
    getById,
};
