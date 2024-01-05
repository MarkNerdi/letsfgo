import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { gameController } from '$lib/server/games/games.controller';
import { GameStatus, PlayerColor, ResultType } from '$lib/game/enums';
import type { GameResult, Stone } from '$lib/game/types';
import { getAreaScoring } from '$lib/game/scorings';
import { getBoardStateFromHistory } from '$lib/game/utils';

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

    if (!deadStones.black || !deadStones.white) {
        await gameController.update(gameId, { deadstonesSelections: deadStones });
        return json({ success: true });
    }
    
    const boardState = getBoardStateFromHistory(game.history.map(move => move.action), stones, game.settings);
    const scoring = getAreaScoring(boardState, game.settings.komi);

    const result: GameResult = {
        type: ResultType.Score,
        deadStones: stones,
        points: scoring,
        winner: scoring.black > scoring.white ? PlayerColor.Black : PlayerColor.White,
    };
    const updatedGame = await gameController.update(gameId, { deadstonesSelections: deadStones, status: GameStatus.Ended, result });
    return json({ success: true, game: updatedGame });
});
