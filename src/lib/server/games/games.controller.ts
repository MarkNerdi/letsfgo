import { GameStatus } from '$lib/game/enums';
import type { GameSettings } from '$lib/game/types';
import { gameCollection } from '$lib/server/db';
import type { Game } from '$lib/server/games/games.types';
import { ObjectId, type UpdateResult } from 'mongodb';


async function create(settings: GameSettings): Promise<Game | null> {
    const game: Game = {
        blackPlayer: undefined,
        whitePlayer: undefined,
        status: GameStatus.NotStarted,
        history: [],
        deadstonesSelections: {
            black: undefined,
            white: undefined,
        },
        result: undefined,
        settings,

        createdBy: undefined,
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
