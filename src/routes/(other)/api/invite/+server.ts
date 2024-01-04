import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Scoring } from '$lib/game/enums';
import type { GameSettings } from '$lib/game/types';
import { inviteController } from '$lib/server/game-invites/game-invites.controller';

export const POST: RequestHandler = (async ({ request, locals }) => {
    const session = await locals.getSession();
    const { columns, rows } = await request.json();


    const user = session?.user;

    const settings: GameSettings = {
        width: columns,
        height: rows,
        initialTime: 5,
        increment: 3,
        komi: 3,
        scoring: Scoring.Area,
    };

    if (!user?.id) {
        return error(400, 'You have to be logged in.');
    }
    if (isNaN(settings.width) || settings.width < 1 || isNaN(settings.height) || settings.height < 1) {
        return error(400, 'Dimension muss eine positive Zahl sein.');
    }
    if (isNaN(settings.initialTime) || settings.initialTime <= 0) {
        return error(400, 'Zeit muss eine positive Zahl sein.');
    }
    if (isNaN(settings.increment) || settings.increment < 0) {
        return error(400, 'Inkrement muss eine positive Zahl sein.');
    }
    if (isNaN(settings.komi) || settings.komi < 0) {
        return error(400, 'Komi muss eine positive Zahl sein.');
    }
    if (settings.scoring !== Scoring.Area && settings.scoring !== Scoring.Territory) {
        return error(400, 'Invalid scoring type');
    }

    const invite = await inviteController.create(settings, user.id);
    return json({ success: true, inviteId: String(invite?._id) });
});
