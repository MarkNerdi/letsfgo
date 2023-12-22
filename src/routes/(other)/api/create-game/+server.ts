import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { gameController } from '$lib/server/games/games.controller';
import { Scoring } from '$lib/game/enums';
import type { GameSettings } from '$lib/game/types';

export const POST: RequestHandler = (async ({ request }) => {
    const { columns, rows } = await request.json();
    const settings: GameSettings = {
        width: columns,
        height: rows,
        initialTime: 5,
        increment: 3,
        komi: 3,
        scoring: Scoring.Area,
    };

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

    const game = await gameController.create(settings);
    if (game) {
        return json({ gameId: game._id });
    } else {
        return error(500, 'Something went wrong.');
    }
});
