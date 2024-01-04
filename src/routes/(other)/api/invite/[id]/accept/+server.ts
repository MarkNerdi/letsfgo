import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { gameController } from '$lib/server/games/games.controller';
import { inviteController } from '$lib/server/game-invites/game-invites.controller';
import { InviteState } from '$lib/server/game-invites/game-invites.types';
import { ObjectId } from 'mongodb';

export const PUT: RequestHandler = (async ({ params, locals }) => {
    const inviteId = params.id;
    const session = await locals.getSession();
    const user = session?.user;

    if (!user?.id) {
        return error(400, 'You have to be logged in.');
    }

    const game = await gameController.getById(inviteId);
    if (game) {
        return json({ success: false, error: 'Game already created' });
    }

    const invite = await inviteController.getById(inviteId);
    if (!invite) {
        return json({ success: false, error: 'Invite not found' });
    }

    await inviteController.update(inviteId, { state: InviteState.Accepted, invitedUserId: new ObjectId(user.id) });

    const newGame = await gameController.create(inviteId, invite.settings, String(invite.createdBy), user.id);
    if (newGame) {
        return json({ gameId: newGame._id });
    } else {
        return error(500, 'Something went wrong.');
    }
});
