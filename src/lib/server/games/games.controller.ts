import { GameStatus } from '$lib/game/enums';
import { gameCollection } from '$lib/server/db';
import type { Game, GameSettings } from '$lib/server/games/games.types';
import { ObjectId } from 'mongodb';


async function create(settings: GameSettings): Promise<Game | null> {
    const game: Game = {
        blackPlayer: undefined,
        whitePlayer: undefined,
        status: GameStatus.NotStarted,
        history: [],
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

export const gameController = {
    create,
    getById,
};
