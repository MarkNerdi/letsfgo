import type { PlayerColor } from '$lib/game/enums';
import type { BoardState } from '$lib/game/types';
import { getBoardStateFromHistory, getDimensionsFromBoardState, placeStone } from '$lib/game/utils';

export function getValidNextMoves(board: BoardState, history: string[], nextPlayerColor: PlayerColor): boolean[][] {
    const { width, height } = getDimensionsFromBoardState(board);
    const validMoves: boolean[][] = Array.from({ length: height }, () => {
        return Array.from({ length: width }, () => false);
    });
    const visited: { [key: string]: boolean } = {};

    for (const [index, row] of board.entries()) {
        for (const [index2, field] of row.entries()) {
            if (visited[`${index},${index2}`]) {
                continue;
            }

            visited[`${index},${index2}`] = true;
            if (field !== undefined) {
                continue;
            }

            const newBoardState = structuredClone(board);
            const { capturedStones } = placeStone(newBoardState, index, index2, nextPlayerColor);

            if (capturedStones.length === 0) {
                validMoves[index][index2] = true;
                continue;
            }
            if (capturedStones.some(stone => stone.x === index && stone.y === index2)) {
                continue;
            }
            if (isKo(newBoardState, history, index, index2)) {
                continue;
            }
            validMoves[index][index2] = true;
        }
    }

    return validMoves;
}

function isKo(board: BoardState, history: string[], x: number, y: number): boolean {
    const potentialKoTurn = history.findLastIndex(move => move === `${x},${y}`);

    if (potentialKoTurn === -1) {
        return false;
    }

    const dimensions = getDimensionsFromBoardState(board);
    const potentialKoBoard = getBoardStateFromHistory(history.slice(0, potentialKoTurn + 1), [], dimensions);

    return JSON.stringify(potentialKoBoard) === JSON.stringify(board);
}
