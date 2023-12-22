import { gameController } from '$lib/server/games/games.controller';
import { json } from '@sveltejs/kit';

export const GET = (async ({ params }) => {
    const gameId = params.id;
    const game = await gameController.getById(gameId);

    if (!game) {
        return json({ success: false, message: 'Game not found' });
    }

    const gameState = {
        history: game.history.map((move) => ({ action: move.action })),
        result: game.result,
        status: game.status,
    };

    return json({ success: true, gameState });
});
