import { FieldState } from '$lib/game/enums';
import type { BoardState, Stone, Unit } from '$lib/game/types';

export function getEvaluatedBoardState(boardState: BoardState): BoardState {
    const { width, height } = getDimensionsFromBoardState(boardState);
    const evaluatedBoardState: BoardState = Array.from({ length: height }, ()=> {
        return Array.from({ length: width }, () => FieldState.Empty);
    });
    const visited: { [key: string]: boolean } = {};


    for (const [index, row] of boardState.entries()) {
        for (const [index2, field] of row.entries()) {
            
            if (visited[`${index},${index2}`]) {
                continue;
            }
            
            if (field === FieldState.Empty) {
                const unit = getUnitContainingCoordinates(index, index2, boardState);
                const surroundingStones = getSurroundingStonesFromUnit(unit, boardState);
                const surroundingColors = [...new Set(surroundingStones.map(stone => boardState[stone.x][stone.y]))];

                unit.forEach(stone => {

                    visited[`${stone.x},${stone.y}`] = true;
                    evaluatedBoardState[stone.x][stone.y] = surroundingColors.length === 1 ? surroundingColors[0] : FieldState.Empty;
                });
            } else {
                visited[`${index},${index2}`] = true;
                evaluatedBoardState[index][index2] = field;
            }
        }
    }
    return evaluatedBoardState;
}

export function getUnitContainingCoordinates(x: number, y: number, board: BoardState): Unit {
    const unit: Unit = [];
    const visited: { [key: string]: boolean } = {};
    const color = board[x][y];

    function getUnitRecursively(currentX: number, currentY: number) {
        if (visited[`${currentX},${currentY}`]) {
            return;
        }

        visited[`${currentX},${currentY}`] = true;
        if (board[currentX][currentY] !== color) {
            return;
        }

        unit.push({ x: currentX, y: currentY });
        
        const adjacentCoordinates = getAdjacentCoordinates(currentX, currentY, board);
        adjacentCoordinates.forEach(adjacent => {
            getUnitRecursively(adjacent.x, adjacent.y);
        });
    }

    getUnitRecursively(x, y);
    return unit;
}

export function getLibertiesOfUnit(unit: Unit, board: BoardState): Stone[] {
    const liberties: Stone[] = [];
    const visited: { [key: string]: boolean } = {};

    function checkStoneRecursively(stone: Stone, index: number) {
        if (index === unit.length) {
            return;
        }

        const adjacentCoordinates = getAdjacentCoordinates(stone.x, stone.y, board);
        adjacentCoordinates.forEach(adjacent => {
            if (visited[`${adjacent.x},${adjacent.y}`]) {
                return;
            }

            visited[`${adjacent.x},${adjacent.y}`] = true;
            if (board[adjacent.x][adjacent.y] === FieldState.Empty) {
                liberties.push(adjacent);
            }
        });

        checkStoneRecursively(unit[index + 1], index + 1);
    }

    checkStoneRecursively(unit[0], 0);
    return liberties;
}

export function getSurroundingUnitsFromUnit(unit: Unit, board: BoardState): Unit[] {
    const surroundingStones = getSurroundingStonesFromUnit(unit, board);

    const surroundingUnits: Unit[] = surroundingStones.map(stone => getUnitContainingCoordinates(stone.x, stone.y, board));

    const uniqueSurroundingUnits: Unit[] = [];
    surroundingUnits.forEach(unit => {
        if (uniqueSurroundingUnits.some(uniqueUnit => uniqueUnit.some((stone) => stone.x === unit[0].x && stone.y === unit[0].y))) {
            return;
        }
        uniqueSurroundingUnits.push(unit);
    });

    return uniqueSurroundingUnits;
}

export function getSurroundingStonesFromUnit(unit: Unit, board: BoardState): Stone[] {
    const stones: Stone[] = [];
    const visited: { [key: string]: boolean } = {};
    const color = board[unit[0].x][unit[0].y];

    function checkStoneRecursively(stone: Stone, index: number) {
        if (index === unit.length) {
            return;
        }
        const adjacentCoordinates = getAdjacentCoordinates(stone.x, stone.y, board);
        adjacentCoordinates.forEach(adjacent => {
            if (visited[`${adjacent.x},${adjacent.y}`]) {
                return;
            }

            visited[`${adjacent.x},${adjacent.y}`] = true;
            if (board[adjacent.x][adjacent.y] === color || board[adjacent.x][adjacent.y] === FieldState.Empty) {
                return;
            }

            stones.push(adjacent);
        });

        checkStoneRecursively(unit[index + 1], index + 1);
    }

    checkStoneRecursively(unit[0], 0);
    return stones;
}

function getAdjacentCoordinates(x: number, y: number, board: BoardState): Stone[] {
    const liberties: Stone[] = [];
    const { width, height } = getDimensionsFromBoardState(board);
    if (x > 0) {
        liberties.push({ x: x - 1, y });
    }
    if (x < width - 1) {
        liberties.push({ x: x + 1, y });
    }
    if (y > 0) {
        liberties.push({ x, y: y - 1 });
    }
    if (y < height - 1) {
        liberties.push({ x, y: y + 1 });
    }
    return liberties;
}

export function getDimensionsFromBoardState(board: BoardState): { width: number, height: number } {
    return {
        width: board.length,
        height: board[0].length,
    };
}
