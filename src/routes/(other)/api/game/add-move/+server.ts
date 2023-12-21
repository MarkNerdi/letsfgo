import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Move } from '$lib/server/games/games.types';
import { gameController } from '$lib/server/games/games.controller';
import { GameStatus } from '$lib/game/enums';

type AddMoveRequest = {
    gameId: string;
    x: number;
    y: number;
    pass: boolean;
};

export const POST: RequestHandler = (async ({ request }) => {
    const { gameId, x, y, pass }: AddMoveRequest = await request.json();

    const game = await gameController.getById(gameId);
    if (!game) {
        return json({ success: false, error: 'Game not found' });
    }

    const move: Move = {
        x,
        y,
        pass,
        time: Date.now(),
    };
    const updatedHistory = [...game.history, move];

    await gameController.update(gameId, { status: GameStatus.InProgress, history: updatedHistory });
    return json({ success: true });
});
