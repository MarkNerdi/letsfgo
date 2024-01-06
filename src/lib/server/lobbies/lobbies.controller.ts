import { DEFAULT_KOMI, DEFAULT_SCORING } from '$lib/constants/default-settings.constants';
import { lobbyCollection } from '$lib/server/db';
import type { DefaultBoardSize, DefaultTimeSettings, Lobby } from '$lib/server/lobbies/lobbies.types';
import { ObjectId, type DeleteResult } from 'mongodb';


async function create(boardSizes:  DefaultBoardSize[], timeSettings: DefaultTimeSettings[], createdBy: string): Promise<Lobby | null> {
    const lobby: Lobby = {
        boardSizes,
        timeSettings,
        komi: DEFAULT_KOMI,
        scoring: DEFAULT_SCORING,
        createdBy: new ObjectId(createdBy),
        createdAt: Date.now(),
    };

    await lobbyCollection.insertOne(lobby);
    return lobby;
}


async function getAll(): Promise<Lobby[]> {
    const lobbies = await lobbyCollection.find().toArray();
    const serializedLobbies = lobbies.map((lobby) => {
        lobby._id = String(lobby._id);
        lobby.createdBy = String(lobby.createdBy);
        return lobby;
    });
    return serializedLobbies;
}

async function deleteOne(id: string): Promise<DeleteResult> {
    return lobbyCollection.deleteOne({ _id: new ObjectId(id) });
}

export const lobbyController = {
    create,
    getAll,
    deleteOne,
};
