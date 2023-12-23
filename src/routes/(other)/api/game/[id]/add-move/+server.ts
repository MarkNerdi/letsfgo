import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Move } from '$lib/server/games/games.types';
import { gameController } from '$lib/server/games/games.controller';
import { GameStatus } from '$lib/game/enums';

type AddMoveRequest = {
    gameId: string;
    action: string;
};

export const POST: RequestHandler = (async ({ params, request }) => {
    const gameId = params.id;
    const { action }: AddMoveRequest = await request.json();

    const game = await gameController.getById(gameId);
    if (!game) {
        return json({ success: false, error: 'Game not found' });
    }

    const move: Move = {
        action,
        time: Date.now(),
    };
    const updatedHistory = [...game.history, move];

    const [secondLast, last] = updatedHistory.slice(-2);

    let status = GameStatus.InProgress;    
    if (secondLast?.action === 'pass' && last?.action === 'pass') {
        status = GameStatus.ChooseDeadStones;
    }

    await gameController.update(gameId, { status, history: updatedHistory });
    return json({ success: true });
});
