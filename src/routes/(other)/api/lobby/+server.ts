import { lobbyController } from '$lib/server/lobbies/lobbies.controller';
import type { DefaultBoardSize, DefaultTimeSettings } from '$lib/server/lobbies/lobbies.types';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET = (async () => {
    const lobbies = await lobbyController.getAll();

    return json({ success: true, lobbies });
});


export const POST: RequestHandler = (async ({ request, locals }) => {
    const session = await locals.getSession();
    const lobbyData = await request.json();

    const user = session?.user;

    if (!user?.id) {
        return error(400, 'You have to be logged in.');
    }
    
    const timeSettings = [...new Set(lobbyData.timeSettings)] as DefaultTimeSettings[];
    const boardSizes = [...new Set(lobbyData.boardSizes)] as DefaultBoardSize[];

    await lobbyController.create(boardSizes, timeSettings, user.id);
    return json({ success: true });
});
