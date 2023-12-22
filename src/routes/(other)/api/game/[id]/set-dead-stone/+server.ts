import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { gameController } from '$lib/server/games/games.controller';
import { GameStatus, PlayerColor, ResultType } from '$lib/game/enums';
import type { GameResult, Stone } from '$lib/game/types';
import { getAreaScoring } from '$lib/game/scorings';

type SetDeadStonesRequest = {
    stones: Stone[];
    player: PlayerColor;
};

export const POST: RequestHandler = (async ({ params, request }) => {
    const gameId = params.id;
    const { stones, player }: SetDeadStonesRequest = await request.json();

    const game = await gameController.getById(gameId);
    if (!game) {
        return json({ success: false, error: 'Game not found' });
    }

    const deadStones = game.deadstonesSelections;
    if (player === PlayerColor.Black) {
        deadStones.black = stones;
    } else if (player === PlayerColor.White) {
        deadStones.white = stones;
    }

    if (deadStones.black === undefined || deadStones.white === undefined) {
        await gameController.update(gameId, { deadstonesSelections: deadStones });
        return json({ success: true });
    } else {
        const cleanedBoardState = game.history.filter((move) => move.action !== 'pass');

        const scoring = getAreaScoring(cleanedBoardState, game.settings.komi);

        const result: GameResult = {
            type: ResultType.ByScore,
            deadStones: stones,
            points: scoring,
            winner: scoring.black > scoring.white ? PlayerColor.Black : PlayerColor.White,
        };
        await gameController.update(gameId, { deadstonesSelections: deadStones, status: GameStatus.Ended });
        return json({ success: true });
    }

});
