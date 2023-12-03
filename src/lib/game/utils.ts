import { FieldState } from '$lib/game/enums';
import type { BoardState } from '$lib/game/types';

export function getUnitContainingCoordinates(x: number, y: number, board: BoardState, width: number, height: number): { x: number, y: number }[] {
    const unit: { x: number, y: number }[] = [];
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
        
        const adjacentCoordinates = getAdjacentCoordinates(currentX, currentY, width, height);
        adjacentCoordinates.forEach(adjacent => {
            getUnitRecursively(adjacent.x, adjacent.y);
        });
    }

    getUnitRecursively(x, y);
    return unit;
}

export function getLibertiesOfUnit(unit: { x: number, y: number }[], board: BoardState, width: number, height: number): { x: number, y: number }[] {
    const liberties: { x: number, y: number }[] = [];
    const visited: { [key: string]: boolean } = {};

    function checkStoneRecursively(stone: { x: number, y: number }, index: number) {
        if (index === unit.length) {
            return;
        }

        const adjacentCoordinates = getAdjacentCoordinates(stone.x, stone.y, width, height);
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

export function getSurroundingUnitsFromUnit(unit: { x: number, y: number }[], board: BoardState, width: number, height: number): { x: number, y: number }[][] {
    const surroundingStones = getSurroundingStonesFromUnit(unit, board, width, height);

    const surroundingUnits: { x: number, y: number }[][] = surroundingStones.map(stone => getUnitContainingCoordinates(stone.x, stone.y, board, width, height));

    return surroundingUnits;
}

function getSurroundingStonesFromUnit(unit: { x: number, y: number }[], board: BoardState, width: number, height: number): { x: number, y: number }[] {
    const stones: { x: number, y: number }[] = [];
    const visited: { [key: string]: boolean } = {};
    const color = board[unit[0].x][unit[0].y];

    function checkStoneRecursively(stone: { x: number, y: number }, index: number) {
        if (index === unit.length) {
            return;
        }

        const adjacentCoordinates = getAdjacentCoordinates(stone.x, stone.y, width, height);
        adjacentCoordinates.forEach(adjacent => {
            if (visited[`${adjacent.x},${adjacent.y}`]) {
                return;
            }

            visited[`${adjacent.x},${adjacent.y}`] = true;
            if (board[adjacent.x][adjacent.y] === color) {
                return;
            }

            stones.push(adjacent);
        });

        checkStoneRecursively(unit[index + 1], index + 1);
    }

    checkStoneRecursively(unit[0], 0);
    return stones;
}

function getAdjacentCoordinates(x: number, y: number, boardWidth: number, boardHeight: number): { x: number, y: number }[] {
    const liberties: { x: number, y: number }[] = [];
    if (x > 0) {
        liberties.push({ x: x - 1, y });
    }
    if (x < boardWidth - 1) {
        liberties.push({ x: x + 1, y });
    }
    if (y > 0) {
        liberties.push({ x, y: y - 1 });
    }
    if (y < boardHeight - 1) {
        liberties.push({ x, y: y + 1 });
    }
    return liberties;
}
