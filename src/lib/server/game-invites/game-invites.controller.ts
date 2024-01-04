import type { GameSettings } from '$lib/game/types';
import { inviteCollection } from '$lib/server/db';
import { InviteState, type GameInvite } from '$lib/server/game-invites/game-invites.types';
import { ObjectId, type UpdateResult } from 'mongodb';


async function create(settings: GameSettings, createdBy: string, invitedPlayerId?: string): Promise<GameInvite | null> {
    const invite: GameInvite = {
        settings,
        state: InviteState.Pending,
        invitedUserId: invitedPlayerId ? new ObjectId(invitedPlayerId) : undefined,
        createdBy: new ObjectId(createdBy),
        createdAt: Date.now(),
    };

    await inviteCollection.insertOne(invite);
    return invite;
}


async function getById(id: string): Promise<GameInvite | null> {
    const invite = await inviteCollection.findOne({ _id: new ObjectId(id) });
    if (invite) {
        invite._id = String(invite._id);
        invite.createdBy = String(invite.createdBy);
    }
    return invite;
}

async function update(id: string, invite: Partial<GameInvite>): Promise<UpdateResult> {
    return inviteCollection.updateOne({ _id: new ObjectId(id) }, { $set: { ...invite } });
}

export const inviteController = {
    create,
    getById,
    update,
};
