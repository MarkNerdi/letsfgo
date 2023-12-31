import { PlayerColor } from '$lib/game/enums';
import type { BoardState } from '$lib/game/types';
import { getEvaluatedBoardState } from '$lib/game/utils';

export function getAreaScoring(boardState: BoardState, komi: number): { black: number, white: number } {
    const evaluatedBoardState = getEvaluatedBoardState(boardState);

    const black = evaluatedBoardState.flat().filter(field => field === PlayerColor.Black).length;
    const white = evaluatedBoardState.flat().filter(field => field === PlayerColor.White).length;
    return { black, white: white + komi };
}
