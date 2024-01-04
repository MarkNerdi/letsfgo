import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.ts';
import { inviteController } from '$lib/server/game-invites/game-invites.controller.ts';
import { gameController } from '$lib/server/games/games.controller.ts';

export const load: PageServerLoad = async ({ params }) => {
    const game = await gameController.getById(params.id);
    if (game) {
        throw redirect(303, `/play/${String(game._id)}}`);
    }

    const invite = await inviteController.getById(params.id);
    if (!invite) {
        throw redirect(303, '/');
    }

    return { invite };
};
