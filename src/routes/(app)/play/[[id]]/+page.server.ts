import { error, type Actions, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.ts';
import { gameController } from '$lib/server/games/games.controller.ts';
import { Scoring } from '$lib/game/enums.ts';
import type { GameSettings } from '$lib/game/types.ts';

export const load: PageServerLoad = (async ({ params }) => {
    if (!params.id) {
        return {
            game: undefined,
        };
    }

    const game = await gameController.getById(params.id);
    if (!game) {
        throw error(404, { message: 'Eintrag nicht gefunden' });
    }
    
    return {
        game,
    };
});


export const actions: Actions = {
    startGame: async ({ request }) => {
        const data = await request.formData();

        const width = Number(data.get('width'));
        const height = Number(data.get('height'));
        const initialTime = Number(data.get('initialTime'));
        const increment = Number(data.get('increment'));
        const komi = Number(data.get('komi'));
        const scoring = Number(data.get('scoring'));

        if (isNaN(width) || width < 1 || isNaN(height) || height < 1) {
            return fail(400, { error: 'Dimension muss eine positive Zahl sein.' });
        }
        if (isNaN(initialTime) || initialTime <= 0) {
            return fail(400, { error: 'Zeit muss eine positive Zahl sein.' });
        }
        if (isNaN(increment) || increment < 0) {
            return fail(400, { error: 'Inkrement muss eine positive Zahl sein.' });
        }
        if (isNaN(komi) || komi < 0) {
            return fail(400, { error: 'Komi muss eine positive Zahl sein.' });
        }

        if (scoring !== Scoring.Area && scoring !== Scoring.Territory) {
            return fail(400, { error: 'Invalid scoring type' });
        }

        const settings: GameSettings = {
            width,
            height,
            initialTime,
            increment,
            komi,
            scoring,
        };

        const game = await gameController.create(settings);
        
        if (game) {
            throw redirect(303, '/play/' + game._id);
        } else {
            return fail(400, { error: 'Komi muss eine positive Zahl sein.' });
        }
    },
    rematch: async ({ request }) => {
        const data = await request.formData();

        const width = Number(data.get('width'));
        const height = Number(data.get('height'));
        const initialTime = Number(data.get('initialTime'));
        const increment = Number(data.get('increment'));
        const komi = Number(data.get('komi'));
        const scoring = Number(data.get('scoring'));

        if (isNaN(width) || width < 1 || isNaN(height) || height < 1) {
            return fail(400, { error: 'Dimension muss eine positive Zahl sein.' });
        }
        if (isNaN(initialTime) || initialTime <= 0) {
            return fail(400, { error: 'Zeit muss eine positive Zahl sein.' });
        }
        if (isNaN(increment) || increment < 0) {
            return fail(400, { error: 'Inkrement muss eine positive Zahl sein.' });
        }
        if (isNaN(komi) || komi < 0) {
            return fail(400, { error: 'Komi muss eine positive Zahl sein.' });
        }

        if (scoring !== Scoring.Area && scoring !== Scoring.Territory) {
            return fail(400, { error: 'Invalid scoring type' });
        }

        const settings: GameSettings = {
            width,
            height,
            initialTime,
            increment,
            komi,
            scoring,
        };

        const game = await gameController.create(settings);
        
        if (game) {
            throw redirect(303, '/play/' + game._id);
        } else {
            return fail(400, { error: 'Komi muss eine positive Zahl sein.' });
        }
    },
};