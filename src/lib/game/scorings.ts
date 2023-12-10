import { FieldState } from '$lib/game/enums';
import type { BoardState } from '$lib/game/types';
import { getDimensionsFromBoardState, getSurroundingStonesFromUnit, getUnitContainingCoordinates } from '$lib/game/utils';

export function getAreaScoring(boardState: BoardState): { black: number, white: number } {
    const { width, height } = getDimensionsFromBoardState(boardState);
    const colorForField: (FieldState | undefined)[][] = Array.from({ length: height }, ()=> {
        return Array.from({ length: width }, () => undefined);
    });


    for (const [index, row] of boardState.entries()) {
        for (const [index2, field] of row.entries()) {
            if (colorForField[index][index2] !== undefined) {
                continue;
            }

            if (field === FieldState.Empty) {
                const unit = getUnitContainingCoordinates(index, index2, boardState);
                const surroundingStones = getSurroundingStonesFromUnit(unit, boardState);
                const surroundingColors = [...new Set(surroundingStones.map(stone => boardState[stone.x][stone.y]))];

                unit.forEach(stone => colorForField[stone.x][stone.y] = surroundingColors.length === 1 ? surroundingColors[0] : FieldState.Empty);
            } else {
                colorForField[index][index2] = field;
            }
        }
    }
    const black = colorForField.flat().filter(field => field === FieldState.Black).length;
    const white = colorForField.flat().filter(field => field === FieldState.White).length;
    return { black, white };
}
