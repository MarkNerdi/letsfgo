import { type Actions, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.ts';
import { gameController } from '$lib/server/games/games.controller.ts';
import { GameStatus, PlayerColor, ResultType, Scoring } from '$lib/game/enums.ts';
import type { GameResult, GameSettings } from '$lib/game/types.ts';

export const load: PageServerLoad = async ({ params }) => {
    const game = await gameController.getById(params.id);
    if (!game) {
        throw redirect(303, '/');
    }
    return { game };
};

export const actions: Actions = {
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
    resign: async ({ request }) => {
        const data = await request.formData();

        const currentPlayer = Number(data.get('currentPlayer'));
        const gameId = String(data.get('gameId'));

        const gameResult: GameResult = {
            type: ResultType.ByResign,
            winner: currentPlayer === PlayerColor.Black ? PlayerColor.White : PlayerColor.Black,
        };

        await gameController.update(gameId, { result: gameResult, status: GameStatus.Ended });
    },
};
