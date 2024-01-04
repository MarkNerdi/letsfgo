import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { gameController } from '$lib/server/games/games.controller';
import { inviteController } from '$lib/server/game-invites/game-invites.controller';
import { InviteState } from '$lib/server/game-invites/game-invites.types';

export const PUT: RequestHandler = (async ({ params }) => {
    const inviteId = params.id;

    const game = await gameController.getById(inviteId);
    if (game) {
        return json({ success: false, error: 'Game already created' });
    }

    const invite = await inviteController.getById(inviteId);
    if (!invite) {
        return json({ success: false, error: 'Invite not found' });
    }
    
    await inviteController.update(inviteId, { state: InviteState.Declined });
    
    return json({ success: true });
});
